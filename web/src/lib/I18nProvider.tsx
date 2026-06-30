"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Locale, type TranslationKey } from "./i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("id");

  const t = useCallback((key: TranslationKey) => translations[locale][key], [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function LangToggle() {
  const { locale, setLocale } = useI18n();
  const isEn = locale === "en";

  return (
    <button
      type="button"
      className="relative flex h-8 w-16 cursor-pointer items-center rounded-full bg-zinc-200 p-1 transition-all hover:bg-zinc-300 focus:outline-none dark:bg-zinc-700 dark:hover:bg-zinc-600 active:scale-95"
      onClick={() => setLocale(isEn ? "id" : "en")}
      aria-label="Toggle language"
    >
      <div
        className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-zinc-800 shadow-sm transition-transform ${
          isEn ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {isEn ? "EN" : "ID"}
      </div>
      <div className="flex w-full justify-between px-[6px] text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
        <span>ID</span>
        <span>EN</span>
      </div>
    </button>
  );
}
