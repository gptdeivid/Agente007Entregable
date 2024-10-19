import { Chat } from "@/components/custom/chat";

export default function ChatPage({
  params,
}: {
  params: { id: string; formData: Record<string, string> };
}) {
  return (
    <Chat
      key={params.id}
      id={params.id}
      initialMessages={[]}
      formData={params.formData}
    />
  );
}
