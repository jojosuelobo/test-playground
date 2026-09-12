import AccountForm from "@/components/account/AccountForm";
import { getServerI18n } from "@/i18n/server";

export default async function AccountPage() {
  const { dict } = await getServerI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">{dict.account.pageTitle}</h1>
      <p className="mb-8 text-gray-600">{dict.account.pageSubtitle}</p>
      <AccountForm />
    </div>
  );
}
