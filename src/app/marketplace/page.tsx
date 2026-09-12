import CourseGrid from "@/components/marketplace/CourseGrid";
import { getServerI18n } from "@/i18n/server";

export default async function MarketplacePage() {
  const { dict } = await getServerI18n();
  return (
    <div data-testid="marketplace-page" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-1 text-3xl font-bold text-gray-900">{dict.marketplace.title}</h1>
      <p className="mb-8 text-gray-600">{dict.marketplace.subtitle}</p>
      <CourseGrid />
    </div>
  );
}
