import SigninContentClient from "@/components/Auth/SigninContentClient";

export const metadata = {
  title: "Sign In — StartupForge",
  description:
    "Sign in to your StartupForge account to manage your startups, submit applications, or discover collaborative venture opportunities.",
  openGraph: {
    title: "Sign In — StartupForge",
    description: "Access your StartupForge workspace and active applications.",
    url: "/signin",
    siteName: "StartupForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In — StartupForge",
    description: "Access your StartupForge workspace and active applications.",
  },
};

export default function SigninPage() {
  return <SigninContentClient />;
}
