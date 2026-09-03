"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { user, isLoading, openLoginModal, openSignupModal, logout } = useAuth();

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
          {isLoading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                data-testid="nav-dashboard-link"
                className="hidden text-sm font-medium text-gray-600 hover:text-indigo-600 sm:inline-block"
              >
                Dashboard
              </Link>
              <Link
                href="/account"
                data-testid="nav-account-link"
                className="hidden text-sm font-medium text-gray-600 hover:text-indigo-600 sm:inline-block"
              >
                Minha conta
              </Link>
              <Button
                variant="secondary"
                size="sm"
                testId="nav-logout-button"
                onClick={logout}
              >
                Sair
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
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                testId="nav-signup-button"
                onClick={openSignupModal}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
