"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { loginSchema } from "@/schemas/auth";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    setServerError("");
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Email o contraseña incorrectos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column - Image Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="/admin-bg.jpg"
          alt="Viziontech Admin Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Viziontech Admin</h2>
          <p className="text-zinc-300 text-lg max-w-md">
            Bienvenido al centro de control. Gestiona todos tus proyectos, servicios y configuraciones de forma segura.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 lg:w-1/2 relative">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex justify-start">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
        <div className="mb-8 text-center">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl brand-gradient text-white font-bold text-lg mb-4">
            vT
          </span>
          <h1 className="text-xl font-semibold text-foreground">Panel administrativo</h1>
          <p className="mt-1 text-sm text-muted-foreground">Inicia sesión para gestionar viziontech</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="email" required>
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@viziontech.com"
                className="pl-9"
                error={!!errors.email}
                {...register("email")}
              />
            </div>
            <FieldError>{errors.email?.message}</FieldError>
          </div>

          <div className="mb-6">
            <Label htmlFor="password" required>
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-9"
                error={!!errors.password}
                {...register("password")}
              />
            </div>
            <FieldError>{errors.password?.message}</FieldError>
          </div>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} viziontech. Acceso restringido a personal autorizado.
        </p>
      </div>
      </div>
    </div>
  );
}
