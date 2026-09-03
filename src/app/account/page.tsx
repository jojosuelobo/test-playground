import AccountForm from "@/components/account/AccountForm";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Minha Conta</h1>
      <p className="mb-8 text-gray-600">Adicione informações sobre você.</p>
      <AccountForm />
    </div>
  );
}
