"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X, ChevronUp, ChevronDown } from "lucide-react";
import { uploadImage, removeUploadedImage } from "@/actions/uploads";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";

/**
 * Galería de imágenes de un proyecto.
 * `value`: [{ url, alt, order }] · `onChange(next)` recibe el arreglo actualizado.
 */
export function GalleryUploader({ value = [], onChange, maxFiles = 10 }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function handleFiles(files) {
    if (!files?.length) return;
    if (value.length + files.length > maxFiles) {
      toast({ type: "error", title: `Máximo ${maxFiles} imágenes en la galería` });
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadImage(formData);
        if (result.success) {
          uploaded.push({ url: result.data.url, alt: "", order: value.length + uploaded.length });
        } else {
          toast({ type: "error", title: "Error al subir imagen", description: result.error });
        }
      }
      if (uploaded.length) onChange([...value, ...uploaded]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function updateAlt(index, alt) {
    const next = [...value];
    next[index] = { ...next[index], alt };
    onChange(next);
  }

  async function removeAt(index) {
    const img = value[index];
    if (img?.url?.startsWith("/api/uploads/")) {
      await removeUploadedImage(img.url);
    }
    onChange(value.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i })));
  }

  function move(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((img, index) => (
          <div key={img.url} className="rounded-lg border border-border bg-surface-muted/40 p-2">
            <div className="relative aspect-square overflow-hidden rounded-md">
              <Image src={img.url} alt={img.alt || ""} fill sizes="200px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Quitar imagen"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-1 left-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-30"
                  aria-label="Mover arriba"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-30"
                  aria-label="Mover abajo"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <Input
              value={img.alt || ""}
              onChange={(e) => updateAlt(index, e.target.value)}
              placeholder="Texto alternativo"
              className="mt-2 h-8 text-xs"
            />
          </div>
        ))}

        {value.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-brand-electric"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span className="text-xs">Agregar</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
