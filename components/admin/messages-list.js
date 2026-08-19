"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, Phone, Building2 } from "lucide-react";
import { setMessageRead, deleteMessage } from "@/actions/messages";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { formatDateTime } from "@/lib/utils";

export function MessagesList({ messages }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expanded, setExpanded] = useState(null);

  function toggleRead(message) {
    startTransition(async () => {
      await setMessageRead(message.id, !message.read);
      router.refresh();
    });
  }

  function handleExpand(message) {
    setExpanded(expanded === message.id ? null : message.id);
    if (!message.read) {
      startTransition(async () => {
        await setMessageRead(message.id, true);
        router.refresh();
      });
    }
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMessage(deleteTarget.id);
      if (result.success) {
        toast({ type: "success", title: "Mensaje eliminado" });
      }
      setDeleteTarget(null);
      router.refresh();
    });
  }

  if (messages.length === 0) {
    return <EmptyState icon={Mail} title="No hay mensajes" description="Los mensajes del formulario de contacto aparecerán aquí." />;
  }

  return (
    <>
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl border bg-surface p-4 transition-colors ${
              message.read ? "border-border" : "border-brand-electric/40 bg-brand-electric/5"
            }`}
          >
            <button className="flex w-full items-start justify-between gap-3 text-left" onClick={() => handleExpand(message)}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!message.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-electric" />}
                  <p className="truncate font-medium">{message.name}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{message.email}</span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{message.subject || message.message}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(message.createdAt)}</span>
            </button>

            {expanded === message.id && (
              <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
                <p className="whitespace-pre-wrap text-foreground">{message.message}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {message.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> {message.phone}
                    </span>
                  )}
                  {message.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" /> {message.company}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(message);
                    }}
                    disabled={isPending}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    {message.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                    Marcar como {message.read ? "no leído" : "leído"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(message);
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar mensaje"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        loading={isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
