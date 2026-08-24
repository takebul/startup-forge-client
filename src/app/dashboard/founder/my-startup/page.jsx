import { getFounderStartup } from "@/lib/api/startups";
import FounderMyStartups from "./FounderMyStartups";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "My Startups — StartupForge Founder Dashboard",
  description:
    "Manage your registered startup profile, funding stage, company logo, and venture descriptions.",
};

export default async function FounderMyStartupPage() {
  const user = await getUserSession();
  const startups = user?.id ? await getFounderStartup(user.id) : [];

  return <FounderMyStartups founder={user} startups={startups} />;
}

