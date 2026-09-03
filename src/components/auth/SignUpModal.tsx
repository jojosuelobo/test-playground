"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import type { AuthUser } from "@/components/auth/AuthContext";

type SignUpModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  onSwitchToLogin: () => void;
};

const initialFormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

export default function SignUpModal({
  open,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: SignUpModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof initialFormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Não foi possível criar a conta.");
        return;
      }

      setForm(initialFormState);
      onSuccess(data.user);
    } catch {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Criar conta" testId="signup-modal">
      <form onSubmit={handleSubmit} data-testid="signup-form">
        <FormField
          label="Nome"
          name="name"
          testId="signup-name-input"
          value={form.name}
          onChange={updateField("name")}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          testId="signup-email-input"
          value={form.email}
          onChange={updateField("email")}
          required
        />
        <FormField
          label="Senha"
          name="password"
          type="password"
          testId="signup-password-input"
          value={form.password}
          onChange={updateField("password")}
          required
        />
        <FormField
          label="Telefone (opcional)"
          name="phone"
          type="tel"
          testId="signup-phone-input"
          value={form.phone}
          onChange={updateField("phone")}
        />
        {error && (
          <p
            data-testid="signup-error-message"
            className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          testId="signup-submit-button"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Já tem conta?{" "}
          <button
            type="button"
            data-testid="signup-switch-to-login-button"
            className="font-semibold text-indigo-600 hover:underline"
            onClick={onSwitchToLogin}
          >
            Entrar
          </button>
        </p>
      </form>
    </Modal>
  );
}
