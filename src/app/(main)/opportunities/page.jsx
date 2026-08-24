import OpportunitiesPage from "@/components/Opportunities/OpportunitiesPage";
import { getOpportunities } from "@/lib/api/opportunities";
import { getStartups } from "@/lib/api/startups";

export const metadata = {
  title: "Browse Startup Opportunities — StartupForge",
  description:
    "Explore open roles across engineering, design, marketing, and operations at high-growth early-stage startups.",
  openGraph: {
    title: "Browse Startup Opportunities — StartupForge",
    description:
      "Find your next collaborative role. Connect directly with founders.",
    url: "/opportunities",
    siteName: "StartupForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Startup Opportunities — StartupForge",
    description:
      "Find your next collaborative role. Connect directly with founders.",
  },
};

const OpportunitiesPageWrapper = async ({ searchParams }) => {
  const query = await searchParams;

  const search = query.search || "";
  const workType = query.workType || "All";
  const industry = query.industry || "All";
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 9);

  const [opportunities, startups] = await Promise.all([
    getOpportunities({ search, workType, industry, page, limit }),
    getStartups(),
  ]);

  return (
    <div>
      <OpportunitiesPage
        opportunities={opportunities}
        startups={startups}
        currentPage={page}
        pageSize={limit}
        totalData={opportunities?.total_data}
      />
    </div>
  );
};

export default OpportunitiesPageWrapper;

