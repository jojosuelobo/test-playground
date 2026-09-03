"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type EnrollmentStatus = "ENROLLED" | "COMPLETED";

type EnrollButtonProps = {
  courseId: string;
  initialStatus: EnrollmentStatus | null;
};

const statusLabel: Record<EnrollmentStatus, string> = {
  ENROLLED: "Matriculado",
  COMPLETED: "Concluído",
};

export default function EnrollButton({ courseId, initialStatus }: EnrollButtonProps) {
  const [status, setStatus] = useState<EnrollmentStatus | null>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setError(data?.message ?? "Não foi possível se matricular.");
        return;
      }
      setStatus("ENROLLED");
    } catch {
      setError("Erro de rede. Tente novamente.");
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
          data-testid="enrollment-dashboard-link"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Ir para o Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="primary"
        size="lg"
        testId="enroll-button"
        onClick={handleEnroll}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Matriculando..." : "Inscrever-se"}
      </Button>
      {error && (
        <p data-testid="enroll-error-message" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
