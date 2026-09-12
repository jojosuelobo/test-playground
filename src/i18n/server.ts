import { cookies } from "next/headers";
import {
  LOCALE_COOKIE,
  defaultLocale,
  getDictionary,
  isLocale,
  type Locale,
} from "./index";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getServerI18n() {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
