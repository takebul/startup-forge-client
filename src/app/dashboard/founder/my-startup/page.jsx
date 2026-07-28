import { getStartups } from "@/lib/api/startups";
import FounderMyStartups from "./FounderMyStartups";

export default async function FounderMyStartupPage() {
  const startups = await getStartups();
  return (
    <>
      <FounderMyStartups startups={startups} />
    </>
  );
}
