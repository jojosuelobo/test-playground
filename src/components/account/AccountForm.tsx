"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";

type Account = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  headline: string | null;
  bio: string | null;
  websiteUrl: string | null;
  facebookUsername: string | null;
  instagramUsername: string | null;
  linkedinUrl: string | null;
  tiktokUsername: string | null;
  xUsername: string | null;
  youtubeUsername: string | null;
};

type FormState = {
  name: string;
  phone: string;
  headline: string;
  bio: string;
  websiteUrl: string;
  facebookUsername: string;
  instagramUsername: string;
  linkedinUrl: string;
  tiktokUsername: string;
  xUsername: string;
  youtubeUsername: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  headline: "",
  bio: "",
  websiteUrl: "",
  facebookUsername: "",
  instagramUsername: "",
  linkedinUrl: "",
  tiktokUsername: "",
  xUsername: "",
  youtubeUsername: "",
};

function toFormState(account: Account): FormState {
  return {
    name: account.name,
    phone: account.phone ?? "",
    headline: account.headline ?? "",
    bio: account.bio ?? "",
    websiteUrl: account.websiteUrl ?? "",
    facebookUsername: account.facebookUsername ?? "",
    instagramUsername: account.instagramUsername ?? "",
    linkedinUrl: account.linkedinUrl ?? "",
    tiktokUsername: account.tiktokUsername ?? "",
    xUsername: account.xUsername ?? "",
    youtubeUsername: account.youtubeUsername ?? "",
  };
}

export default function AccountForm() {
  const { user } = useAuth();
  const isTeacher = user?.role === "TEACHER";
  const [account, setAccount] = useState<Account | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.account) return;
        setAccount(data.account);
        setForm(toFormState(data.account));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field: keyof FormState) => (value: string) => {
    setSuccess(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Não foi possível salvar as alterações.");
        return;
      }

      setAccount(data.account);
      setForm(toFormState(data.account));
      setSuccess(true);
    } catch {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) {
    return (
      <p data-testid="account-loading" className="text-gray-500">
        Carregando...
      </p>
    );
  }

  return (
    <div data-testid="account-page" className="flex flex-col gap-8 sm:flex-row">
      <aside className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 sm:w-56 sm:flex-none sm:items-start">
        <span
          data-testid="account-avatar"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-semibold text-white"
        >
          {account.name.charAt(0).toUpperCase()}
        </span>
        <div className="text-center sm:text-left">
          <p data-testid="account-sidebar-name" className="font-semibold text-gray-900">
            {account.name}
          </p>
          <p className="text-sm text-gray-500">{account.email}</p>
          {!isTeacher && (
            <Link
              href={`/u/${account.id}`}
              data-testid="account-public-profile-link"
              className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline"
            >
              Ver perfil público
            </Link>
          )}
        </div>
      </aside>

      <form
        onSubmit={handleSubmit}
        data-testid="account-form"
        className="flex-1 rounded-xl border border-gray-200 bg-white p-6"
      >
        {!isTeacher && (
          <div data-testid="account-basic-info-section">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">Dados Básicos</h2>
            <p className="mb-5 text-sm text-gray-500">
              Essas informações aparecem no seu perfil e no certificado.
            </p>

            <FormField
              label="Nome"
              name="name"
              testId="account-name-input"
              value={form.name}
              onChange={updateField("name")}
              required
            />

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                value={account.email}
                disabled
                data-testid="account-email-display"
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
              />
            </div>

            <FormField
              label="Telefone"
              name="phone"
              type="tel"
              testId="account-phone-input"
              value={form.phone}
              onChange={updateField("phone")}
            />

            <FormField
              label="Headline"
              name="headline"
              testId="account-headline-input"
              placeholder='Ex: "Estudante de Java" ou "Desenvolvedor Backend"'
              value={form.headline}
              onChange={updateField("headline")}
            />

            <div className="mb-6">
              <label
                htmlFor="bio"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Biografia
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                data-testid="account-bio-input"
                value={form.bio}
                onChange={(event) => updateField("bio")(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        )}

        <h2 className="mb-1 text-lg font-semibold text-gray-900">Links</h2>
        <p className="mb-5 text-sm text-gray-500">
          Adicione links das suas redes sociais.
        </p>

        <FormField
          label="Website"
          name="websiteUrl"
          testId="account-website-input"
          placeholder="https://..."
          value={form.websiteUrl}
          onChange={updateField("websiteUrl")}
        />
        <FormField
          label="Facebook"
          name="facebookUsername"
          testId="account-facebook-input"
          placeholder="facebook.com/username"
          value={form.facebookUsername}
          onChange={updateField("facebookUsername")}
        />
        <FormField
          label="Instagram"
          name="instagramUsername"
          testId="account-instagram-input"
          placeholder="instagram.com/username"
          value={form.instagramUsername}
          onChange={updateField("instagramUsername")}
        />
        <FormField
          label="LinkedIn"
          name="linkedinUrl"
          testId="account-linkedin-input"
          placeholder="linkedin.com/in/username"
          value={form.linkedinUrl}
          onChange={updateField("linkedinUrl")}
        />
        <FormField
          label="TikTok"
          name="tiktokUsername"
          testId="account-tiktok-input"
          placeholder="tiktok.com/@username"
          value={form.tiktokUsername}
          onChange={updateField("tiktokUsername")}
        />
        <FormField
          label="X"
          name="xUsername"
          testId="account-x-input"
          placeholder="x.com/username"
          value={form.xUsername}
          onChange={updateField("xUsername")}
        />
        <FormField
          label="YouTube"
          name="youtubeUsername"
          testId="account-youtube-input"
          placeholder="youtube.com/@username"
          value={form.youtubeUsername}
          onChange={updateField("youtubeUsername")}
        />

        {error && (
          <p
            data-testid="account-error-message"
            className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </p>
        )}
        {success && (
          <p
            data-testid="account-success-message"
            className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
          >
            Alterações salvas com sucesso.
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          testId="account-save-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </div>
  );
}
