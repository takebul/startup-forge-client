import PricingPageContent from "@/components/Pricing/PricingPageContent";

export const metadata = {
  title: "Pricing Plans & Upgrades — StartupForge",
  description:
    "Explore transparent subscription tiers for founders and collaborators. Unlock expanded opportunity listings, priority talent placement, and direct platform networking.",
  openGraph: {
    title: "Pricing Plans & Upgrades — StartupForge",
    description:
      "Simple, scalable plans for early-stage founders and active collaborators.",
    url: "/pricing",
    siteName: "StartupForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans & Upgrades — StartupForge",
    description:
      "Simple, scalable plans for early-stage founders and active collaborators.",
  },
};

export default function PricingPage() {
  return <PricingPageContent />;
}
