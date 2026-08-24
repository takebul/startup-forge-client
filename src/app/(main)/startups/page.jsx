import { getStartups } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import StartupsPage from "@/components/Startups/StartupsPage";

export const metadata = {
  title: "Explore Startups — StartupForge",
  description:
    "Discover high-growth, early-stage startups actively recruiting co-founders, engineers, designers, and growth specialists.",
  openGraph: {
    title: "Explore Startups — StartupForge",
    description:
      "Browse and connect with innovative startups looking for top-tier talent.",
    url: "/startups",
    siteName: "StartupForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Startups — StartupForge",
    description:
      "Browse and connect with innovative startups looking for top-tier talent.",
  },
};

const StartupsPageWrapper = async () => {
  const startups = await getStartups();
  const opportunities = await getOpportunities();

  return (
    <div>
      <StartupsPage startups={startups} opportunities={opportunities} />
    </div>
  );
};

export default StartupsPageWrapper;

