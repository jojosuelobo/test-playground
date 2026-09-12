import Link from "next/link";
import HomeCTA from "@/components/home/HomeCTA";
import { getServerI18n } from "@/i18n/server";

const scenarioHrefs: Record<string, string | null> = {
  button: "/marketplace",
  signup: null,
  flaky: "/demo/flaky",
};

export default async function HomePage() {
  const { dict } = await getServerI18n();
  const h = dict.home;
  const scenarios = [
    { key: "button", ...h.scenarios.button, href: scenarioHrefs.button },
    { key: "signup", ...h.scenarios.signup, href: scenarioHrefs.signup },
    { key: "flaky", ...h.scenarios.flaky, href: scenarioHrefs.flaky },
  ];

  return (
    <div data-testid="home-page">
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:py-32">
          <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {h.badge}
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {h.titleLead}{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {h.titleHighlight}
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-gray-600">{h.subtitle}</p>
          <HomeCTA />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          {h.scenariosHeading}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {scenarios.map((scenario) => (
            <div
              key={scenario.key}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm"
            >
              <h3 className="mb-2 font-semibold text-gray-900">{scenario.title}</h3>
              <p className="flex-1 text-sm text-gray-600">{scenario.description}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                {h.whereLabel}: {scenario.where}
              </p>
              {scenario.href && scenario.linkLabel && (
                <Link
                  href={scenario.href}
                  className="mt-1 text-sm font-medium text-indigo-600 hover:underline"
                >
                  {scenario.linkLabel} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
