import { getFounderStartup } from "@/lib/api/startups";
import FounderMyStartups from "./FounderMyStartups";
import { getUserSession } from "@/lib/core/session";

export default async function FounderMyStartupPage() {
  const user = await getUserSession();
  const startups = await getFounderStartup(user?.id);

  return <FounderMyStartups founder={user} startups={startups} />;
}
