"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CertificateView from "@/components/certificate/CertificateView";

type CertificateData = {
  userName: string;
  courseTitle: string;
  completedAt: string;
};

export default function CertificateClient({ enrollmentId }: { enrollmentId: string }) {
  const [data, setData] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/enrollments/${enrollmentId}/certificate`).then(async (res) => {
      if (cancelled) return;
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message ?? "Certificado não disponível.");
        return;
      }
      setData(json);
    });
    return () => {
      cancelled = true;
    };
  }, [enrollmentId]);

  if (error) {
    return (
      <div data-testid="certificate-error-state" className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="mb-4 text-gray-600">{error}</p>
        <Link href="/dashboard" data-testid="certificate-back-to-dashboard-link" className="font-medium text-indigo-600 hover:underline">
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <p data-testid="certificate-loading" className="mx-auto max-w-2xl px-4 py-10 text-center text-gray-500">
        Carregando certificado...
      </p>
    );
  }

  return (
    <div className="px-4 py-10">
      <CertificateView
        userName={data.userName}
        courseTitle={data.courseTitle}
        completedAt={data.completedAt}
      />
    </div>
  );
}
