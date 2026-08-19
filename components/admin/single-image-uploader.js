"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage, removeUploadedImage } from "@/actions/uploads";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/**
 * Subida de una única imagen (imagen principal de proyecto, logo de empresa…).
 * `value` es la URL actual (o "" si no hay imagen). `onChange(url)` recibe la nueva URL.
 */
export function SingleImageUploader({ value, onChange, label = "Imagen", aspect = "aspect-video" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      if (!result.success) {
        toast({ type: "error", title: "Error al subir imagen", description: result.error });
        return;
      }
      const previousUrl = value;
      onChange(result.data.url);
      if (previousUrl && previousUrl.startsWith("/api/uploads/")) {
        removeUploadedImage(previousUrl);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (value?.startsWith("/api/uploads/")) {
      await removeUploadedImage(value);
    }
    onChange("");
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-foreground">{label}</p>}
      <div
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface-muted/40",
          aspect
        )}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill sizes="400px" className="object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Quitar imagen"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center gap-2 p-6 text-muted-foreground hover:text-foreground"
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
            <span className="text-sm">{uploading ? "Subiendo…" : "Subir imagen"}</span>
            <span className="text-xs">JPG, PNG, WEBP o GIF · máx. 5MB</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs font-medium text-brand-electric hover:underline"
        >
          Cambiar imagen
        </button>
      )}
    </div>
  );
}
