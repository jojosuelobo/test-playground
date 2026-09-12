"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import type { AuthUser } from "@/components/auth/AuthContext";
import { useI18n } from "@/i18n/LanguageProvider";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  onSwitchToSignup: () => void;
};

export default function LoginModal({
  open,
  onClose,
  onSuccess,
  onSwitchToSignup,
}: LoginModalProps) {
  const { dict } = useI18n();
  const t = dict.auth.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? t.errorFallback);
        return;
      }

      setEmail("");
      setPassword("");
      onSuccess(data.user);
    } catch {
      setError(dict.common.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t.title} testId="login-modal">
      <p
        data-testid="login-professor-credentials-hint"
        className="mb-4 rounded-md bg-indigo-50 px-3 py-2 text-xs text-indigo-700"
      >
        {t.professorHintPrefix} <strong>professor@admin.com</strong> / <strong>admin</strong>
      </p>
      <form onSubmit={handleSubmit} data-testid="login-form">
        <FormField
          label={t.emailLabel}
          name="email"
          type="email"
          testId="login-email-input"
          value={email}
          onChange={setEmail}
          required
        />
        <FormField
          label={t.passwordLabel}
          name="password"
          type="password"
          testId="login-password-input"
          value={password}
          onChange={setPassword}
          required
        />
        {error && (
          <p
            data-testid="login-error-message"
            className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          testId="login-submit-button"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? t.submitting : t.submit}
        </Button>
        <p className="mt-4 text-center text-sm text-gray-500">
          {t.noAccount}{" "}
          <button
            type="button"
            data-testid="login-switch-to-signup-button"
            className="font-semibold text-indigo-600 hover:underline"
            onClick={onSwitchToSignup}
          >
            {t.signupLink}
          </button>
        </p>
      </form>
    </Modal>
  );
}
