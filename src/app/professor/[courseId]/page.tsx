import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import ProfessorCourseStudents from "@/components/professor/ProfessorCourseStudents";

export default async function ProfessorCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  const { courseId } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <ProfessorCourseStudents courseId={courseId} />
    </div>
  );
}
