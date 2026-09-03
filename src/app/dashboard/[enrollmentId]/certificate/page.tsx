import CertificateClient from "@/components/certificate/CertificateClient";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>;
}) {
  const { enrollmentId } = await params;

  return (
    <div data-testid="certificate-page">
      <CertificateClient enrollmentId={enrollmentId} />
    </div>
  );
}
