"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useI18n } from "@/i18n/LanguageProvider";

type EnrollmentStatus = "ENROLLED" | "COMPLETED";

type EnrollButtonProps = {
  courseId: string;
  courseLanguage: string;
  initialStatus: EnrollmentStatus | null;
};

export default function EnrollButton({ courseId, courseLanguage, initialStatus }: EnrollButtonProps) {
  const { dict } = useI18n();
  const t = dict.course.enroll;
  const statusLabel: Record<EnrollmentStatus, string> = {
    ENROLLED: t.statusEnrolled,
    COMPLETED: t.statusCompleted,
  };

  const [status, setStatus] = useState<EnrollmentStatus | null>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Demo-only for the Cypress "cy.prompt + Self Heal" talk segment: the SQL course's
  // enroll button shows a different label on every page load, while id/data-testid/color
  // stay the same - a text-based selector would flake, but an AI prompt describing "the
  // blue enroll button" (or the id) keeps finding the right element regardless.
  const [enrollLabel] = useState(() =>
    courseLanguage === "SQL"
      ? t.sqlLabels[Math.floor(Math.random() * t.sqlLabels.length)]
      : t.defaultLabel
  );

  const handleEnroll = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 409) {
        setError(data?.message ?? t.errorFallback);
        return;
      }
      setStatus("ENROLLED");
    } catch {
      setError(dict.common.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Badge color="green" testId="enrollment-status-badge">
          ✓ {statusLabel[status]}
        </Badge>
        <Link
          href="/dashboard"
          id="enrollment-dashboard-link"
          data-testid="enrollment-dashboard-link"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          {t.goToDashboard}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="primary"
        size="lg"
        id="enroll-button"
        testId="enroll-button"
        onClick={handleEnroll}
        disabled={isSubmitting}
      >
        {isSubmitting ? t.enrolling : enrollLabel}
      </Button>
      {error && (
        <p data-testid="enroll-error-message" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
