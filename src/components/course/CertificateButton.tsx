"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { useI18n } from "@/i18n/LanguageProvider";

export default function CertificateButton({ enrollmentId }: { enrollmentId: string }) {
  const { dict } = useI18n();
  return (
    <Link
      href={`/dashboard/${enrollmentId}/certificate`}
      id="certificate-button"
      data-testid="certificate-button"
      className={buttonStyles({ variant: "warning" })}
    >
      {dict.course.certificateButton}
    </Link>
  );
}
