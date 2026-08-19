"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { contactSchema } from "@/schemas/contact";
import { createMessage } from "@/actions/messages";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function ContactForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", company: "", subject: "", message: "", website: "" },
  });

  async function onSubmit(values) {
    const result = await createMessage(values);
    if (!result.success) {
      toast({ type: "error", title: "No se pudo enviar el mensaje", description: result.error });
      return;
    }
    reset();
  }

  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50 p-10 text-center dark:bg-emerald-500/10">
        <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-lg font-semibold">¡Mensaje enviado!</h3>
        <p className="text-sm text-muted-foreground">
          Gracias por escribirnos. Te contactaremos lo antes posible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot anti-spam: invisible para personas */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Nombre
          </Label>
          <Input id="name" error={!!errors.name} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input id="email" type="email" error={!!errors.email} {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="company">Empresa</Label>
          <Input id="company" {...register("company")} />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Asunto</Label>
        <Input id="subject" {...register("subject")} placeholder="Cotización de sistema, soporte, etc." />
      </div>

      <div>
        <Label htmlFor="message" required>
          Mensaje
        </Label>
        <Textarea id="message" rows={5} error={!!errors.message} {...register("message")} />
        <FieldError>{errors.message?.message}</FieldError>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Enviar mensaje
      </Button>
    </form>
  );
}
