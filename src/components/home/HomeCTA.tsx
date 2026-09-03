"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import Button from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function HomeCTA() {
  const { user, isLoading, openLoginModal, openSignupModal } = useAuth();

  if (isLoading) return <div className="h-[52px]" />;

  if (user) {
    const isTeacher = user.role === "TEACHER";
    return (
      <Link
        href={isTeacher ? "/professor" : "/dashboard"}
        data-testid="home-dashboard-link"
        className={buttonStyles({ variant: "primary", size: "lg" })}
      >
        {isTeacher ? "Ir para o Painel do Professor" : "Ir para o Dashboard"}
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        variant="secondary"
        size="lg"
        testId="home-login-button"
        onClick={openLoginModal}
      >
        Log In
      </Button>
      <Button
        variant="primary"
        size="lg"
        testId="home-signup-button"
        onClick={openSignupModal}
      >
        Sign Up
      </Button>
    </div>
  );
}
