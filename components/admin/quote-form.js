"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { quoteSchema, QUOTE_STATUSES } from "@/schemas/quote";
import { createQuote, updateQuote } from "@/actions/quotes";
import { CURRENCIES, calculateQuoteTotals, formatMoney, quoteStatusLabel } from "@/lib/quotes";
import { Input, Textarea, Select, Label, FieldError, FieldHint } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { QuoteItemsField } from "@/components/admin/quote-items-field";
import { StringListField } from "@/components/admin/string-list-field";
import { ClientFormModal } from "@/components/admin/clients-manager";
import { useToast } from "@/components/ui/toast";

function dateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function QuoteForm({ quote, clients }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!quote;
  const [clientList, setClientList] = useState(clients);
  const [newClientOpen, setNewClientOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      clientId: quote?.clientId || clientList[0]?.id || "",
      title: quote?.title || "",
      description: quote?.description || "",
      status: quote?.status || "BORRADOR",
      currency: quote?.currency || "USD",
      discount: quote?.discount ?? 0,
      taxRate: quote?.taxRate ?? 0,
      validUntil: dateInputValue(quote?.validUntil),
      scopeIncludes: quote?.scopeIncludes?.length ? quote.scopeIncludes : [],
      scopeExcludes: quote?.scopeExcludes?.length ? quote.scopeExcludes : [],
      paymentTerms: quote?.paymentTerms || "",
      notes: quote?.notes || "",
      items: quote?.items?.length
        ? quote.items.map(({ description, quantity, unitPrice, discount }) => ({
            description,
            quantity,
            unitPrice,
            discount,
          }))
        : [{ description: "", quantity: 1, unitPrice: 0, discount: 0 }],
    },
  });

  const items = watch("items");
  const currency = watch("currency");
  const globalDiscount = watch("discount");
  const taxRate = watch("taxRate");
  const totals = calculateQuoteTotals(items, globalDiscount, taxRate);

  async function onSubmit(values) {
    const action = isEditing ? updateQuote.bind(null, quote.id) : createQuote;
    const result = await action(values);

    if (!result.success) {
      toast({ type: "error", title: "No se pudo guardar la cotización", description: result.error });
      return;
    }

    toast({
      type: "success",
      title: isEditing ? "Cotización actualizada" : "Cotización creada",
      description: result.data.number,
    });
    router.push(`/admin/cotizaciones/${result.data.id}`);
    router.refresh();
  }

  function onInvalid() {
    toast({
      type: "error",
      title: "Revisa el formulario",
      description: "Hay campos incompletos o inválidos (marcados en rojo) antes de poder guardar.",
    });
  }

  function handleClientCreated(newClient) {
    setClientList((prev) => [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name)));
    setValue("clientId", newClient.id, { shouldValidate: true });
    setNewClientOpen(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6 pb-10">
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Cliente</h2>
        </CardHeader>
        <CardContent>
          {clientList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay clientes registrados.{" "}
              <button type="button" className="font-medium text-brand-electric hover:underline" onClick={() => setNewClientOpen(true)}>
                Crea el primero
              </button>
              .
            </p>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="clientId" required>
                  Cliente
                </Label>
                <Select id="clientId" error={!!errors.clientId} {...register("clientId")}>
                  {clientList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                <FieldError>{errors.clientId?.message}</FieldError>
              </div>
              <Button type="button" variant="outline" onClick={() => setNewClientOpen(true)}>
                <Plus className="h-4 w-4" />
                Nuevo cliente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Detalle del proyecto cotizado</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" required>
              Título
            </Label>
            <Input id="title" error={!!errors.title} {...register("title")} placeholder="Sistema de gestión para barbería" />
            <FieldError>{errors.title?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="description" required>
              Descripción
            </Label>
            <Textarea id="description" rows={4} error={!!errors.description} {...register("description")} />
            <FieldError>{errors.description?.message}</FieldError>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Ítems y precios</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <Controller
            name="items"
            control={control}
            render={({ field }) => (
              <QuoteItemsField value={field.value} onChange={field.onChange} currency={currency} errors={errors.items} />
            )}
          />
          <FieldError>{errors.items?.message}</FieldError>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="currency">Moneda</Label>
              <Select id="currency" {...register("currency")}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="discount">Descuento global</Label>
              <Input id="discount" type="number" min={0} step="0.01" {...register("discount")} />
            </div>
            <div>
              <Label htmlFor="taxRate">Impuesto (%)</Label>
              <Input id="taxRate" type="number" min={0} max={100} step="0.01" {...register("taxRate")} />
            </div>
          </div>

          <div className="ml-auto w-full max-w-xs space-y-1 rounded-lg bg-surface-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatMoney(totals.subtotal, currency)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Descuento</span>
                <span>-{formatMoney(totals.discount, currency)}</span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuesto</span>
                <span>{formatMoney(totals.tax, currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-1 text-base font-semibold text-brand-cobalt">
              <span>Total</span>
              <span>{formatMoney(totals.total, currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Alcance</h2>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Incluye</p>
            <Controller
              name="scopeIncludes"
              control={control}
              render={({ field }) => (
                <StringListField value={field.value} onChange={field.onChange} placeholder="Ej. Panel administrativo" addLabel="Agregar" />
              )}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">No incluye</p>
            <Controller
              name="scopeExcludes"
              control={control}
              render={({ field }) => (
                <StringListField value={field.value} onChange={field.onChange} placeholder="Ej. Dominio y hosting" addLabel="Agregar" />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Validez y forma de pago</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="validUntil">Válida hasta</Label>
              <Input id="validUntil" type="date" {...register("validUntil")} />
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select id="status" {...register("status")}>
                {QUOTE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {quoteStatusLabel(s)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="paymentTerms">Forma de pago</Label>
            <Textarea id="paymentTerms" rows={2} {...register("paymentTerms")} placeholder="Ej. 50% al iniciar, 30% en desarrollo, 20% al finalizar" />
            <FieldHint>Texto libre, se muestra tal cual en el PDF.</FieldHint>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Notas y condiciones</h2>
        </CardHeader>
        <CardContent>
          <Textarea rows={5} {...register("notes")} placeholder="Validez de la cotización, garantía, soporte, condiciones adicionales…" />
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-background/95 py-4 backdrop-blur">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={clientList.length === 0}>
          {isEditing ? "Guardar cambios" : "Crear cotización"}
        </Button>
      </div>

      <ClientFormModal open={newClientOpen} client={null} onClose={() => setNewClientOpen(false)} onSaved={handleClientCreated} />
    </form>
  );
}
