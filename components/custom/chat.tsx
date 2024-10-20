"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState, useEffect } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { Sidebar } from "@/components/custom/sidebar";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { useChatContext } from "@/contexts/ChatContext";

import { MultimodalInput } from "./multimodal-input";

export function Chat({
  id,
  initialMessages,
  formData,
}: {
  id: string;
  initialMessages: Array<Message>;
  formData: Record<string, string>;
}) {
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

  const handleQuestionSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!allStepsCompleted) {
      updateStep(currentStepIndex, input);
      setLocalMessages((prev) => [
        ...prev,
        { id: `response-${currentStepIndex}`, role: "user", content: input },
      ]);
      setInput("");
      moveToNextStep();
    } else {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-row h-dvh bg-background">
      <Sidebar />
      <div className="grow flex flex-col justify-between pb-4 md:pb-8">
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
      </div>
    </div>
  );
}
