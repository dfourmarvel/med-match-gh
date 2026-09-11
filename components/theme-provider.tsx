"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      // The toggle only offers light/dark, so following the OS preference just
      // meant a dark-OS visitor landed on dark with no way to express "system".
      enableSystem={false}
      disableTransitionOnChange
      storageKey="medmatch-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
