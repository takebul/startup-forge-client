import { getOpportunityDetails } from "@/lib/api/opportunities";
import { getStartups } from "@/lib/api/startups";
import { getProfileData } from "@/lib/api/users";
import { getApplicationsByCollaboratorId } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import OpportunityDetailsPage from "@/components/Opportunities/OpportunityDetailsPage";

// A public page must never crash or redirect because an optional fetch failed.
// The protected routes return 401/403 to unauthenticated or unauthorized callers;
// catching that here keeps the page rendering for everyone.
const safe = async (fn, fallback) => {
  try {
    const result = await fn();
    return result ?? fallback;
  } catch {
    return fallback;
  }
};

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

  const role = String(user?.role || "").toLowerCase();
  const accountType = String(user?.accountType || "").toLowerCase();
  const isCollaborator =
    accountType === "collaborator" || role === "collaborator";

  // 2. Fetch public data always; fetch personal data best-effort and only for
  //    the user it belongs to. The founder profile is derived from public
  //    startup data, never from the full users table.
  const [opportunity, startups, profileData, userApplications] =
    await Promise.all([
      getOpportunityDetails(id),
      getStartups(),
      user?.id
        ? safe(() => getProfileData(user.id), null)
        : Promise.resolve(null),
      user?.id && isCollaborator
        ? safe(() => getApplicationsByCollaboratorId(user.id), [])
        : Promise.resolve([]),
    ]);

  const fullUser = profileData?.data || profileData?.user || profileData;

  // 3. Fetch logged-in collaborator's submitted applications to check if already applied
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
        userData={[]}
        initialUser={fullUser ? { ...user, ...fullUser } : user}
        initialAppliedOppIds={initialAppliedOppIds}
      />
    </div>
  );
};

export default OpportunityDetailsPageWrapper;
