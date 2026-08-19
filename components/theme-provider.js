"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

const ThemeContext = createContext(undefined);

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
  return resolved;
}

/**
 * Provider de tema propio (claro/oscuro/sistema), reemplaza a next-themes.
 * El script anti-flash vive en lib/theme-script.js y se inyecta desde el
 * Server Component raíz — este provider solo sincroniza el estado de React
 * con la clase ya aplicada al <html> por ese script.
 */
function readStoredTheme() {
  if (typeof window === "undefined") return "system";
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || "system";
  } catch {
    return "system";
  }
}

export function ThemeProvider({ children }) {
  // Inicializador perezoso: en el servidor no hay localStorage (devuelve
  // "system"), y como este provider no renderiza nada que dependa de
  // `theme` directamente (el <script> anti-flash ya aplicó la clase real al
  // <html> antes de hidratar), no hay riesgo de mismatch de hidratación.
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    function handleChange() {
      setThemeState((current) => {
        if (current === "system") applyTheme("system");
        return current;
      });
    }
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage no disponible (modo privado, etc.) — el tema no persiste.
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
