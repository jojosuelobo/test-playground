import CourseGrid from "@/components/marketplace/CourseGrid";

export default function MarketplacePage() {
  return (
    <div data-testid="marketplace-page" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-1 text-3xl font-bold text-gray-900">Marketplace de Cursos</h1>
      <p className="mb-8 text-gray-600">Escolha um curso e comece a aprender hoje.</p>
      <CourseGrid />
    </div>
  );
}
