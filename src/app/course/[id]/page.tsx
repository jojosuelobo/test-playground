import CourseDetail from "@/components/course/CourseDetail";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div data-testid="course-detail-page" className="mx-auto max-w-3xl px-4 py-12">
      <CourseDetail courseId={id} />
    </div>
  );
}
