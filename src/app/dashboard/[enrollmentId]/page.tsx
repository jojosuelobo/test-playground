import EnrolledCourseDetail from "@/components/dashboard/EnrolledCourseDetail";

export default async function EnrolledCourseDetailPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>;
}) {
  const { enrollmentId } = await params;

  return (
    <div data-testid="enrolled-course-detail-page" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <EnrolledCourseDetail enrollmentId={enrollmentId} />
    </div>
  );
}
