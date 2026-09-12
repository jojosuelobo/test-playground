"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import ModuleSection from "@/components/course/ModuleSection";
import CompleteCourseButton from "@/components/course/CompleteCourseButton";
import CertificateButton from "@/components/course/CertificateButton";
import { getCourseVisual } from "@/lib/courseVisuals";
import { useI18n } from "@/i18n/LanguageProvider";

type Module = {
  id: string;
  title: string;
  order: number;
  youtubeId: string;
};

type EnrollmentDetail = {
  id: string;
  status: "ENROLLED" | "COMPLETED";
  course: {
    id: string;
    title: string;
    language: string;
    modules: Module[];
  };
};

export default function EnrolledCourseDetail({
  enrollmentId,
}: {
  enrollmentId: string;
}) {
  const { dict } = useI18n();
  const t = dict.dashboard;
  const [enrollment, setEnrollment] = useState<EnrollmentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/enrollments/${enrollmentId}`).then(async (res) => {
      if (cancelled) return;
      if (!res.ok) {
        setError(t.enrollmentNotFound);
        return;
      }
      const json = await res.json();
      setEnrollment(json.enrollment);
    });
    return () => {
      cancelled = true;
    };
  }, [enrollmentId, t.enrollmentNotFound]);

  const handleCompleted = () =>
    setEnrollment((prev) => (prev ? { ...prev, status: "COMPLETED" } : prev));

  if (error) {
    return (
      <div data-testid="enrolled-course-detail-error" className="text-center">
        <p className="mb-4 text-gray-600">{error}</p>
        <Link
          href="/dashboard"
          data-testid="enrolled-course-detail-back-to-dashboard-link"
          className="font-medium text-indigo-600 hover:underline"
        >
          {dict.common.backToDashboard}
        </Link>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <p data-testid="enrolled-course-detail-loading" className="text-gray-500">
        {dict.common.loading}
      </p>
    );
  }

  const visual = getCourseVisual(enrollment.course.language);

  return (
    <div data-testid="enrolled-course-detail">
      <Link
        href="/dashboard"
        data-testid="enrolled-course-back-link"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600"
      >
        {t.backToDashboardArrow}
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <span
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg ${visual.tileBg} text-2xl`}
        >
          {visual.emoji}
        </span>
        <div className="flex-1">
          <Badge color={visual.badgeColor} className="mb-1">
            {enrollment.course.language}
          </Badge>
          <h1
            data-testid="enrolled-course-detail-title"
            className="text-2xl font-bold text-gray-900"
          >
            {enrollment.course.title}
          </h1>
        </div>
        <Badge
          color={enrollment.status === "COMPLETED" ? "green" : "amber"}
          testId="enrolled-course-detail-status"
        >
          {enrollment.status === "COMPLETED" ? t.statusCompleted : t.statusInProgress}
        </Badge>
      </div>

      {enrollment.course.modules.map((module) => (
        <ModuleSection
          key={module.id}
          title={module.title}
          order={module.order}
          youtubeId={module.youtubeId}
        />
      ))}

      <div className="mt-4">
        {enrollment.status === "COMPLETED" ? (
          <CertificateButton enrollmentId={enrollment.id} />
        ) : (
          <CompleteCourseButton
            enrollmentId={enrollment.id}
            onCompleted={handleCompleted}
          />
        )}
      </div>
    </div>
  );
}
