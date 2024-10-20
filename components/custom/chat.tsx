"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { Message as PreviewMessage } from "@/components/custom/message";
import { Sidebar } from "@/components/custom/sidebar";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { useChatContext } from "@/contexts/ChatContext";

import { MultimodalInput } from "./multimodal-input";
import { Button } from "@/components/ui/button";

export function Chat({
  id,
  initialMessages,
  formData,
}: {
  id: string;
  initialMessages: Array<Message>;
  formData: Record<string, string>;
}) {
  const searchParams = useSearchParams();
  const companyInfo = {
    marca: searchParams?.get("marca") || "",
    industria: searchParams?.get("industria") || "",
    numEmpleados: searchParams?.get("numEmpleados") || "",
    anosEnMercado: searchParams?.get("anosEnMercado") || "",
    productoMasVendido: searchParams?.get("productoMasVendido") || "",
    ingresosMensuales: searchParams?.get("ingresosMensuales") || "",
    tamanoTicketPromedio: searchParams?.get("tamanoTicketPromedio") || "",
  };
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { id, formData },
      initialMessages,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const {
    steps,
    currentStepIndex,
    updateStep,
    moveToNextStep,
    allStepsCompleted,
  } = useChatContext();

  const [localMessages, setLocalMessages] =
    useState<Array<Message>>(initialMessages);

  const [reportContent, setReportContent] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!allStepsCompleted) {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `step-${currentStepIndex}`,
          role: "assistant",
          content: steps[currentStepIndex].question,
        },
      ]);
    }
  }, [currentStepIndex, allStepsCompleted]);

  const handleQuestionSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!allStepsCompleted) {
      const isValid = await updateStep(currentStepIndex, input);
      if (isValid) {
        setLocalMessages((prev) => [
          ...prev,
          { id: `response-${currentStepIndex}`, role: "user", content: input },
        ]);
        setInput("");
        moveToNextStep();
      } else {
        toast.error(
          "La respuesta no es adecuada para la pregunta. Intenta con una nueva respuesta :)",
          {
            style: {
              color: "red",
            },
            duration: 4000,
            closeButton: true,
          }
        );
        setInput("");
      }
    } else {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: "user-final",
          role: "user",
          content: "Please analyze the provided information.",
        },
      ]);
      try {
        const response = await axios.post("/api/analyze", {
          companyInfo: companyInfo,
          steps: steps.map((step) => ({
            title: step.title,
            question: step.question,
            response: step.response,
          })),
        });

        setReportContent(response.data.analysis);
        setShowReport(true);
      } catch (error) {
        console.error("Error submitting analysis:", error);
        toast.error("Error submitting analysis. Please try again.");
      }
    }
  };

  const toggleView = () => {
    setShowReport(!showReport);
  };

  return (
    <div className="flex flex-row h-dvh bg-background">
      <Sidebar />
      <div className="grow flex flex-col justify-between pb-4 md:pb-8">
        {showReport ? (
          <div className="grow overflow-y-auto w-full max-w-4xl mx-auto px-4 py-12 bg-black text-white shadow-lg rounded-lg">
            <Button onClick={toggleView} className="mb-6" variant="outline">
              Regresar al chat
            </Button>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
              className="prose prose-lg prose-invert max-w-none prose-headings:text-blue-400 prose-a:text-blue-300 prose-strong:text-gray-300 prose-ul:list-disc prose-ol:list-decimal"
            >
              {reportContent || ""}
            </ReactMarkdown>
          </div>
        ) : (
          <>
            <div
              ref={messagesContainerRef}
              className="grow overflow-y-auto flex flex-col gap-4 w-full max-w-3xl mx-auto px-4"
            >
              {localMessages.map((message) => (
                <PreviewMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  attachments={message.experimental_attachments}
                  toolInvocations={message.toolInvocations}
                />
              ))}
              <div
                ref={messagesEndRef}
                className="shrink-0 min-w-[24px] min-h-[24px]"
              />
            </div>

            <form
              className="w-full max-w-3xl mx-auto px-4"
              onSubmit={handleQuestionSubmit}
            >
              <MultimodalInput
                input={input}
                setInput={setInput}
                handleSubmit={handleQuestionSubmit}
                isLoading={isLoading}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={localMessages}
                append={append}
              />
            </form>
          </>
        )}
        {reportContent && !showReport && (
          <div className="w-full max-w-3xl mx-auto px-4 mt-4">
            <Button
              onClick={toggleView}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out hover:scale-105"
            >
              Ver reporte completo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
