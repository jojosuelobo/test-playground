"use client";

import { useEffect, useState } from "react";

// Demo-only page for the Cypress "Retry" talk segment. Each field below re-randomizes
// on every page load, so a fresh Cypress test retry gets a fresh roll of the dice.
export default function FlakyDemoPage() {
  const [showBanner, setShowBanner] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setShowBanner(Math.random() < 0.5);

    const delayMs = Math.floor(Math.random() * 6000); // 0-6s
    const timer = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div data-testid="flaky-demo-page" className="mx-auto max-w-xl px-4 py-24 text-center">
      {showBanner && (
        <p
          data-testid="flaky-banner"
          className="mb-6 rounded-lg bg-indigo-50 px-4 py-3 text-indigo-700"
        >
          🎉 Oferta especial só hoje!
        </p>
      )}
      {ready && (
        <p data-testid="flaky-ready-message" className="text-lg font-semibold text-emerald-600">
          Pronto!
        </p>
      )}
    </div>
  );
}
