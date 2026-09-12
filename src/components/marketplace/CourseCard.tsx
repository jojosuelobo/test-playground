"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getCourseVisual } from "@/lib/courseVisuals";
import { useI18n } from "@/i18n/LanguageProvider";

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: string;
  imageUrl: string | null;
};

export default function CourseCard({ course }: { course: CourseSummary }) {
  const { dict } = useI18n();
  const visual = getCourseVisual(course.language);

  return (
    <Link
      href={`/course/${course.id}`}
      data-testid={`course-card-${course.slug}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${visual.tileBg} text-xl`}
        >
          {visual.emoji}
        </span>
        <Badge color={visual.badgeColor} testId={`course-card-language-${course.slug}`}>
          {course.language}
        </Badge>
      </div>
      <h3
        data-testid={`course-card-title-${course.slug}`}
        className="mb-1 text-lg font-semibold text-gray-900"
      >
        {course.title}
      </h3>
      <p className="mb-4 flex-1 text-sm text-gray-600">{course.description}</p>
      <span className="text-sm font-medium text-indigo-600 group-hover:underline">
        {dict.marketplace.viewCourse}
      </span>
    </Link>
  );
}
