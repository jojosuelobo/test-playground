import HomeCTA from "@/components/home/HomeCTA";

const features = [
  {
    emoji: "💻",
    title: "Cursos práticos",
    description: "Java, C++, Python, JavaScript e SQL com módulos em vídeo.",
  },
  {
    emoji: "🎯",
    title: "Aprenda no seu ritmo",
    description: "Matricule-se, assista aos módulos e conclua quando quiser.",
  },
  {
    emoji: "🏆",
    title: "Certificado ao concluir",
    description: "Receba um certificado assim que finalizar cada curso.",
  },
];

export default function HomePage() {
  return (
    <div data-testid="home-page">
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:py-32">
          <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Playground de automação de testes
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Aprenda a programar com{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              cursos práticos
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-gray-600">
            Crie sua conta, explore o marketplace de cursos, matricule-se e
            conclua módulos para receber seu certificado.
          </p>
          <HomeCTA />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="mb-3 text-3xl">{feature.emoji}</div>
              <h3 className="mb-1 font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
