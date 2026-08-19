"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectGallery({ mainImage, images, name }) {
  const allImages = [
    ...(mainImage ? [{ url: mainImage, alt: name }] : []),
    ...images.filter((img) => img.url !== mainImage),
  ];

  const [active, setActive] = useState(allImages[0]);

  if (allImages.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-surface-muted text-muted-foreground">
        <ImageOff className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-muted">
        <Image src={active.url} alt={active.alt || name} fill sizes="800px" className="object-cover" priority />
      </div>

      {allImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img) => (
            <button
              key={img.url}
              onClick={() => setActive(img)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                active.url === img.url ? "border-brand-electric" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt={img.alt || name} fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
