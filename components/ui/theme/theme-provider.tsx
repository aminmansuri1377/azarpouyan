"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  /** Resolved theme actually applied to <html>. */
  theme: Theme;
  /** The concrete theme ("light" | "dark") after resolving "system". */
  resolvedTheme: "light" | "dark";
  /** Set the theme and persist it. */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark (ignores "system"). */
  toggleTheme: () => void;
}

const STORAGE_KEY = "kga-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Theme to use before localStorage is read. Default: "light". */
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  // Start with the chosen default (light) so SSR and first paint match.
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // On mount: read persisted preference (or fall back to default).
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored ?? defaultTheme;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(initial);
  }, [defaultTheme]);

  // Keep the DOM in sync whenever `theme` changes, and listen for OS changes
  // when the user picked "system".
  useEffect(() => {
    const resolved = theme === "system" ? resolveSystemTheme() : theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolvedTheme(resolved);
    applyTheme(resolved);

    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = resolveSystemTheme();
      setResolvedTheme(next);
      applyTheme(next);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return ctx;
}

/**
 * Inline script string for `next/script` (beforeInteractive) or a raw <script>
 * tag placed in <head>. Runs before React hydrates to prevent a flash of the
 * wrong theme (FOUC). Defaults to light when nothing is stored.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${STORAGE_KEY}");
    var resolved = stored === "dark" || (!stored && false)
      ? "dark"
      : "light";
    if (resolved === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  } catch (e) {}
})();
`;
