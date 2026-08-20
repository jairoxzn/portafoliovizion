"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { clientSchema } from "@/schemas/client";
import { createClient, updateClient, deleteClient } from "@/actions/clients";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export function ClientsManager({ clients }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteClient(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast({ type: "success", title: "Cliente eliminado" });
      setDeleteTarget(null);
      router.refresh();
    } else {
      toast({ type: "error", title: "No se pudo eliminar", description: result.error });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing({})}>
          <Plus className="h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState icon={Users} title="Sin clientes" description="Registra tu primer cliente para poder crear cotizaciones." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Email / Teléfono</th>
                <th className="px-4 py-3 font-medium">Cotizaciones</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.contactName || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.email || client.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client._count?.quotes ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(client)} className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground" aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(client)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10" aria-label="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ClientFormModal
        open={!!editing}
        client={editing?.id ? editing : null}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar cliente"
        description={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export function ClientFormModal({ open, client, onClose, onSaved }) {
  const { toast } = useToast();
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      taxId: "",
      contactName: "",
      contactRole: "",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      city: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: client?.name || "",
        taxId: client?.taxId || "",
        contactName: client?.contactName || "",
        contactRole: client?.contactRole || "",
        phone: client?.phone || "",
        whatsapp: client?.whatsapp || "",
        email: client?.email || "",
        address: client?.address || "",
        city: client?.city || "",
        notes: client?.notes || "",
      });
    }
  }, [open, client, reset]);

  async function onSubmit(values) {
    const result = isEditing ? await updateClient(client.id, values) : await createClient(values);
    if (!result.success) {
      toast({ type: "error", title: "No se pudo guardar", description: result.error });
      return;
    }
    toast({ type: "success", title: isEditing ? "Cliente actualizado" : "Cliente creado" });
    onSaved(result.data);
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Editar cliente" : "Nuevo cliente"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="client-name" required>
              Nombre / Razón social
            </Label>
            <Input id="client-name" error={!!errors.name} {...register("name")} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="client-taxId">RUC / DNI</Label>
            <Input id="client-taxId" {...register("taxId")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="client-contactName">Nombre de contacto</Label>
            <Input id="client-contactName" {...register("contactName")} />
          </div>
          <div>
            <Label htmlFor="client-contactRole">Cargo</Label>
            <Input id="client-contactRole" {...register("contactRole")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="client-email">Email</Label>
            <Input id="client-email" type="email" error={!!errors.email} {...register("email")} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="client-phone">Teléfono</Label>
            <Input id="client-phone" {...register("phone")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="client-whatsapp">WhatsApp</Label>
            <Input id="client-whatsapp" placeholder="+58 000-0000000" {...register("whatsapp")} />
          </div>
          <div>
            <Label htmlFor="client-city">Ciudad</Label>
            <Input id="client-city" {...register("city")} />
          </div>
        </div>

        <div>
          <Label htmlFor="client-address">Dirección</Label>
          <Input id="client-address" {...register("address")} />
        </div>

        <div>
          <Label htmlFor="client-notes">Notas</Label>
          <Textarea id="client-notes" rows={3} {...register("notes")} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
