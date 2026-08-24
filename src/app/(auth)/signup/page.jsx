import SignupContentClient from "@/components/Auth/SignupContentClient";

export const metadata = {
  title: "Create Account — StartupForge",
  description:
    "Join StartupForge as a Founder or Collaborator. Build early-stage startup ventures, recruit talent, or find your next collaborative project.",
  openGraph: {
    title: "Create Account — StartupForge",
    description:
      "Join the StartupForge ecosystem as a founder or collaborative specialist.",
    url: "/signup",
    siteName: "StartupForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Account — StartupForge",
    description:
      "Join the StartupForge ecosystem as a founder or collaborative specialist.",
  },
};

export default function SignupPage() {
  return <SignupContentClient />;
}
