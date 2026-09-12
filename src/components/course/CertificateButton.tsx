import Link from "next/link";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function CertificateButton({ enrollmentId }: { enrollmentId: string }) {
  return (
    <Link
      href={`/dashboard/${enrollmentId}/certificate`}
      id="certificate-button"
      data-testid="certificate-button"
      className={buttonStyles({ variant: "warning" })}
    >
      🏆 Ver Certificado
    </Link>
  );
}
