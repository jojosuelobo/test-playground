import Link from "next/link";
import { buttonStyles } from "@/components/ui/buttonStyles";

export default function ViewMarketplaceButton() {
  return (
    <Link
      href="/marketplace"
      data-testid="view-marketplace-button"
      className={buttonStyles({ variant: "primary" })}
    >
      View Marketplace
    </Link>
  );
}
