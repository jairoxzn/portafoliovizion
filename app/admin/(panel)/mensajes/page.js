import { listMessages } from "@/actions/messages";
import { MessagesList } from "@/components/admin/messages-list";

export const metadata = { title: "Mensajes" };

export default async function AdminMessagesPage() {
  const messages = await listMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mensajes</h1>
        <p className="text-sm text-muted-foreground">
          {messages.length} mensaje(s) · {unread} sin leer
        </p>
      </div>
      <MessagesList messages={messages} />
    </div>
  );
}
