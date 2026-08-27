import { getOpportunities } from "@/lib/api/opportunities";
import { getProfileData, getUsersData } from "@/lib/api/users";
import { getStartupDetails } from "@/lib/api/startups";
import { getApplicationsByCollaboratorId } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import StartupDetails from "@/components/Startups/StartupDetails";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const startup = await getStartupDetails(id).catch(() => null);
  const startupName =
    startup?.startup_name || startup?.name || "Startup Details";
  const description =
    startup?.description?.slice(0, 160) ||
    `Explore ${startupName} on StartupForge. View open roles, team members, and funding stage.`;

  return {
    title: `${startupName} — StartupForge`,
    description,
    openGraph: {
      title: `${startupName} — StartupForge`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${startupName} — StartupForge`,
      description,
    },
  };
}

const StartupDetailsPage = async ({ params }) => {
  const { id } = await params;

  // 1. Fetch user session first to determine role
  const user = await getUserSession();

  const resolvedRole =
    user?.role === "admin"
      ? "admin"
      : user?.accountType || (user?.role !== "user" ? user?.role : null);

  // 2. Fetch opportunity details, startups, and conditionally users data
  const [opportunities, userData, startup, profileData] = await Promise.all([
    getOpportunities(),
    resolvedRole === "admin" ? getUsersData() : Promise.resolve([]),
    getStartupDetails(id),
    user?.id ? getProfileData(user.id) : Promise.resolve(null),
  ]);

  const fullUser = profileData?.data || profileData?.user || profileData;

  // 2. Fetch logged-in collaborator's existing applications
  const userApplications = user?.id
    ? await getApplicationsByCollaboratorId(user?.id)
    : [];

  // 3. Extract array of opportunity IDs the user has already submitted to
  const initialAppliedOppIds = Array.isArray(userApplications)
    ? userApplications
        .map((app) =>
          String(app.opportunityId || app.convertedOppId || app._id),
        )
        .filter(Boolean)
    : [];

  return (
    <div>
      <StartupDetails
        startups={startup}
        opportunities={opportunities}
        userData={userData}
        initialUser={fullUser ? { ...user, ...fullUser } : user}
        initialAppliedOppIds={initialAppliedOppIds}
      />
    </div>
  );
};

export default StartupDetailsPage;
