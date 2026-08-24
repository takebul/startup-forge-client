import { getOpportunityDetails } from "@/lib/api/opportunities";
import { getStartups } from "@/lib/api/startups";
import { getUsersData } from "@/lib/api/users";
import { getApplicationsById } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import OpportunityDetailsPage from "@/components/Opportunities/OpportunityDetailsPage";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const opp = await getOpportunityDetails(id).catch(() => null);
  const roleTitle =
    opp?.roleTitle || opp?.role_title || opp?.title || "Opportunity Details";
  const startupName = opp?.startupName || opp?.startup_name || "Startup Team";
  const description =
    opp?.description?.slice(0, 160) ||
    `Apply for the ${roleTitle} role at ${startupName} on StartupForge.`;

  return {
    title: `${roleTitle} at ${startupName} — StartupForge`,
    description,
    openGraph: {
      title: `${roleTitle} at ${startupName} — StartupForge`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${roleTitle} at ${startupName} — StartupForge`,
      description,
    },
  };
}

const OpportunityDetailsPageWrapper = async ({ params }) => {
  const { id } = await params;

  // 1. Fetch user session first to determine role
  const user = await getUserSession();

  const resolvedRole =
    user?.role === "admin"
      ? "admin"
      : user?.accountType || (user?.role !== "user" ? user?.role : null);

  // 2. Fetch opportunity details, startups, and conditionally users data
  const [opportunity, startups, userData] = await Promise.all([
    getOpportunityDetails(id),
    getStartups(),
    resolvedRole === "admin" ? getUsersData() : Promise.resolve([]),
  ]);

  // 2. Fetch logged-in collaborator's submitted applications to check if already applied
  const userApplications = user?.id ? await getApplicationsById(user.id) : [];

  const initialAppliedOppIds = Array.isArray(userApplications)
    ? userApplications
        .map((app) =>
          String(app.opportunityId || app.convertedOppId || app._id),
        )
        .filter(Boolean)
    : [];

  return (
    <div>
      <OpportunityDetailsPage
        opportunity={opportunity}
        startups={startups}
        userData={userData}
        initialAppliedOppIds={initialAppliedOppIds}
      />
    </div>
  );
};

export default OpportunityDetailsPageWrapper;

