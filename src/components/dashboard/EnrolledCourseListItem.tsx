import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getCourseVisual } from "@/lib/courseVisuals";

export type EnrolledCourseSummary = {
  id: string;
  status: "ENROLLED" | "COMPLETED";
  course: {
    id: string;
    title: string;
    language: string;
  };
};

export default function EnrolledCourseListItem({
  enrollment,
}: {
  enrollment: EnrolledCourseSummary;
}) {
  const visual = getCourseVisual(enrollment.course.language);

  return (
    <Link
      href={`/dashboard/${enrollment.id}`}
      id={`enrolled-course-list-item-${enrollment.id}`}
      data-testid={`enrolled-course-list-item-${enrollment.id}`}
      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition hover:border-indigo-300 hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-md ${visual.tileBg} text-base`}
        >
          {visual.emoji}
        </span>
        <span
          data-testid={`enrolled-course-title-${enrollment.id}`}
          className="font-medium text-gray-900"
        >
          {enrollment.course.title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          color={enrollment.status === "COMPLETED" ? "green" : "amber"}
          testId={`enrolled-course-status-${enrollment.id}`}
        >
          {enrollment.status === "COMPLETED" ? "Concluído" : "Em andamento"}
        </Badge>
        <span className="text-gray-400">→</span>
      </div>
    </Link>
  );
}
