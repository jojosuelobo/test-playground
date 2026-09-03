"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/auth/LoginModal";
import SignUpModal from "@/components/auth/SignUpModal";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER";
};

type ActiveModal = "login" | "signup" | null;

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeModal: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setUser(data?.user ?? null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthSuccess = useCallback(
    (authenticatedUser: AuthUser) => {
      setUser(authenticatedUser);
      setActiveModal(null);
      router.push(authenticatedUser.role === "TEACHER" ? "/professor" : "/dashboard");
    },
    [router]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        openLoginModal: () => setActiveModal("login"),
        openSignupModal: () => setActiveModal("signup"),
        closeModal: () => setActiveModal(null),
        logout,
      }}
    >
      {children}
      <LoginModal
        open={activeModal === "login"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleAuthSuccess}
        onSwitchToSignup={() => setActiveModal("signup")}
      />
      <SignUpModal
        open={activeModal === "signup"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={() => setActiveModal("login")}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
