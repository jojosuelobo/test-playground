"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/LanguageProvider";

export default function Navbar() {
  const { user, isLoading, openLoginModal, openSignupModal, logout } = useAuth();
  const { locale, dict, setLocale } = useI18n();

  const nextLocale = locale === "en" ? "pt" : "en";

  return (
    <header
      data-testid="navbar"
      className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          data-testid="nav-home-link"
          className="flex items-center gap-2 text-lg font-bold text-gray-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-base">
            🎓
          </span>
          CodePlayground
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            data-testid="nav-language-toggle"
            aria-label={dict.nav.languageAria}
            onClick={() => setLocale(nextLocale)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
          >
            🌐 {nextLocale.toUpperCase()}
          </button>

          {isLoading ? null : user ? (
            <>
              {user.role === "TEACHER" ? (
                <Link
                  href="/professor"
                  data-testid="nav-professor-link"
                  className="hidden text-sm font-medium text-gray-600 hover:text-indigo-600 sm:inline-block"
                >
                  {dict.nav.professorPanel}
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  data-testid="nav-dashboard-link"
                  className="hidden text-sm font-medium text-gray-600 hover:text-indigo-600 sm:inline-block"
                >
                  {dict.nav.dashboard}
                </Link>
              )}
              <Link
                href="/account"
                data-testid="nav-account-link"
                className="hidden text-sm font-medium text-gray-600 hover:text-indigo-600 sm:inline-block"
              >
                {dict.nav.myAccount}
              </Link>
              <Button
                variant="secondary"
                size="sm"
                testId="nav-logout-button"
                onClick={logout}
              >
                {dict.nav.logout}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                testId="nav-login-button"
                onClick={openLoginModal}
              >
                {dict.nav.login}
              </Button>
              <Button
                variant="primary"
                size="sm"
                testId="nav-signup-button"
                onClick={openSignupModal}
              >
                {dict.nav.signup}
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
