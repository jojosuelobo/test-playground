"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useI18n } from "@/i18n/LanguageProvider";

type CompleteCourseButtonProps = {
  enrollmentId: string;
  onCompleted: () => void;
};

export default function CompleteCourseButton({
  enrollmentId,
  onCompleted,
}: CompleteCourseButtonProps) {
  const { dict } = useI18n();
  const t = dict.course.complete;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}/complete`, {
        method: "PATCH",
      });
      if (!res.ok) {
        setError(t.errorFallback);
        return;
      }
      onCompleted();
    } catch {
      setError(dict.common.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Button
        variant="success"
        id="complete-course-button"
        testId="complete-course-button"
        onClick={handleClick}
        disabled={isSubmitting}
      >
        {isSubmitting ? t.submitting : t.label}
      </Button>
      {error && (
        <p data-testid="complete-course-error-message" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
