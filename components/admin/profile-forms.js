"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { profileSchema, changePasswordSchema } from "@/schemas/auth";
import { updateProfile, changePassword } from "@/actions/auth";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function ProfileForms({ user }) {
  return (
    <div className="max-w-xl space-y-6">
      <ProfileInfoForm user={user} />
      <ChangePasswordForm />
    </div>
  );
}

function ProfileInfoForm({ user }) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name || "", email: user.email || "" },
  });

  async function onSubmit(values) {
    const result = await updateProfile(values);
    if (!result.success) {
      toast({ type: "error", title: "No se pudo actualizar", description: result.error });
      return;
    }
    toast({ type: "success", title: "Perfil actualizado" });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold">Datos personales</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ChangePasswordForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values) {
    const result = await changePassword(values);
    if (!result.success) {
      toast({ type: "error", title: "No se pudo cambiar la contraseña", description: result.error });
      return;
    }
    toast({ type: "success", title: "Contraseña actualizada" });
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold">Cambiar contraseña</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" required>
              Contraseña actual
            </Label>
            <Input id="currentPassword" type="password" error={!!errors.currentPassword} {...register("currentPassword")} />
            <FieldError>{errors.currentPassword?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="newPassword" required>
              Nueva contraseña
            </Label>
            <Input id="newPassword" type="password" error={!!errors.newPassword} {...register("newPassword")} />
            <FieldError>{errors.newPassword?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="confirmPassword" required>
              Confirmar nueva contraseña
            </Label>
            <Input id="confirmPassword" type="password" error={!!errors.confirmPassword} {...register("confirmPassword")} />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Actualizar contraseña
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
