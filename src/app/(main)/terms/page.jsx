import LegalPageContent from "@/components/Legal/LegalPageContent";
import { termsContent } from "@/components/Legal/terms-content";

export const metadata = {
  title: "Terms of Service — StartupForge",
  description:
    "The terms governing your use of StartupForge — covering accounts, founder and collaborator responsibilities, subscriptions and billing, prohibited conduct, and liability.",
  openGraph: {
    title: "Terms of Service — StartupForge",
    description:
      "Clear terms, fair to everyone. Read the rules that govern your use of StartupForge.",
    url: "/terms",
    siteName: "StartupForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — StartupForge",
    description:
      "The terms governing your use of StartupForge — accounts, billing, conduct, and liability.",
  },
};

export default function TermsPage() {
  return <LegalPageContent {...termsContent} />;
}
