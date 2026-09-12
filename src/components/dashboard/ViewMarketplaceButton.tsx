"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { useI18n } from "@/i18n/LanguageProvider";

export default function ViewMarketplaceButton() {
  const { dict } = useI18n();
  return (
    <Link
      href="/marketplace"
      data-testid="view-marketplace-button"
      className={buttonStyles({ variant: "primary" })}
    >
      {dict.dashboard.viewMarketplace}
    </Link>
  );
}
