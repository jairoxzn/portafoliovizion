"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Indica si el componente ya se montó en el cliente, sin disparar un
 * setState dentro de un efecto (evita el warning de renders en cascada).
 * Útil para evitar mismatches de hidratación en UI que depende del tema
 * (next-themes) u otro estado exclusivo del cliente.
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
