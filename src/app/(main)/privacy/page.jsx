import LegalPageContent from "@/components/Legal/LegalPageContent";
import { privacyContent } from "@/components/Legal/privacy-content";

export const metadata = {
  title: "Privacy Policy — StartupForge",
  description:
    "How StartupForge collects, uses, and protects your personal information — covering accounts, applications, subscriptions, cookies, and your privacy rights.",
  openGraph: {
    title: "Privacy Policy — StartupForge",
    description:
      "Your data, protected by design. Learn how StartupForge handles your personal information.",
    url: "/privacy",
    siteName: "StartupForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — StartupForge",
    description:
      "How StartupForge collects, uses, and protects your personal information.",
  },
};

export default function PrivacyPage() {
  return <LegalPageContent {...privacyContent} />;
}
