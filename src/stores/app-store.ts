import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/lib/i18n";

type Theme = "light" | "dark";
type AppState = {
  theme: Theme;
  locale: Locale;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      locale: "en",
      sidebarOpen: false,
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setLocale: (locale) => set({ locale }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    { name: "cbp-preferences", partialize: ({ theme, locale }) => ({ theme, locale }) },
  ),
);
