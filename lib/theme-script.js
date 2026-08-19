// Script "anti-flash" para el tema (claro/oscuro/sistema). Se inyecta como
// <script> directo desde el Server Component raíz (app/layout.js) — NO desde
// un componente cliente — para no chocar con el nuevo warning de React 19
// "Encountered a script tag while rendering React component".
export const THEME_STORAGE_KEY = "theme";

export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var stored = localStorage.getItem(key);
    var theme = stored || "system";
    var resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  } catch (e) {}
})();
`;
