type CertificateViewProps = {
  userName: string;
  courseTitle: string;
  completedAt: string;
};

export default function CertificateView({
  userName,
  courseTitle,
  completedAt,
}: CertificateViewProps) {
  const formattedDate = new Date(completedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      data-testid="certificate-view"
      className="mx-auto max-w-2xl rounded-2xl border-4 border-double border-amber-400 bg-white p-10 text-center shadow-lg"
    >
      <div className="mb-4 text-4xl">🏆</div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-600">
        Certificado de Conclusão
      </p>
      <p className="mb-6 text-sm text-gray-500">Certificamos que</p>
      <p
        data-testid="certificate-user-name"
        className="mb-6 text-3xl font-bold text-gray-900"
      >
        {userName}
      </p>
      <p className="mb-2 text-sm text-gray-500">concluiu com sucesso o curso</p>
      <p
        data-testid="certificate-course-title"
        className="mb-8 text-2xl font-semibold text-indigo-700"
      >
        {courseTitle}
      </p>
      <p data-testid="certificate-completed-date" className="text-sm text-gray-500">
        Concluído em {formattedDate}
      </p>
    </div>
  );
}
