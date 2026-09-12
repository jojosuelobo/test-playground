import { en } from "./dictionaries/en";
import { pt } from "./dictionaries/pt";

export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, pt };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
