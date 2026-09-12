import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { getServerI18n } from "@/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerI18n();
  return {
    title: "CodePlayground",
    description: dict.meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale } = await getServerI18n();

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <LanguageProvider initialLocale={locale}>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
