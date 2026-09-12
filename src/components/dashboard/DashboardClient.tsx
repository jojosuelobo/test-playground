"use client";

import { useEffect, useState } from "react";
import ViewMarketplaceButton from "@/components/dashboard/ViewMarketplaceButton";
import EnrolledCourseListItem, {
  type EnrolledCourseSummary,
} from "@/components/dashboard/EnrolledCourseListItem";
import { useI18n } from "@/i18n/LanguageProvider";

export default function DashboardClient() {
  const { dict } = useI18n();
  const t = dict.dashboard;
  const [enrollments, setEnrollments] = useState<EnrolledCourseSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/enrollments")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setEnrollments(data.enrollments);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div data-testid="dashboard-page" className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <ViewMarketplaceButton />
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t.myCourses}</h2>

        {enrollments === null && (
          <p data-testid="dashboard-loading" className="text-gray-500">
            {dict.common.loading}
          </p>
        )}

        {enrollments !== null && enrollments.length === 0 && (
          <p
            data-testid="dashboard-empty-state"
            className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500"
          >
            {t.emptyState}
          </p>
        )}

        {enrollments && enrollments.length > 0 && (
          <div data-testid="enrolled-course-list" className="space-y-2">
            {enrollments.map((enrollment) => (
              <EnrolledCourseListItem key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
