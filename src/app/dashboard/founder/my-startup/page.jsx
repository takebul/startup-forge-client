import { getStartups } from "@/lib/api/startups";
import FounderMyStartup from "./FounderMyStartups";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function FounderMyStartupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const startups = await getStartups(user?.id);

  return (
    <>
      <FounderMyStartup startups={startups} />
    </>
  );
}
