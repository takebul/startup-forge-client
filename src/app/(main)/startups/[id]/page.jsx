import { getOpportunities } from "@/lib/api/opportunities";
import { getProfileData } from "@/lib/api/users";
import { getStartupDetails } from "@/lib/api/startups";
import { getApplicationsByCollaboratorId } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import StartupDetails from "@/components/Startups/StartupDetails";

// A public page must never crash or redirect because an optional fetch failed.
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

  const role = String(user?.role || "").toLowerCase();
  const accountType = String(user?.accountType || "").toLowerCase();
  const isCollaborator =
    accountType === "collaborator" || role === "collaborator";

  // 2. Fetch public data always; fetch personal data best-effort and only for
  //    the user it belongs to. The founder profile is derived from public
  //    startup data, never from the full users table.
  const [opportunities, startup, profileData, userApplications] =
    await Promise.all([
      getOpportunities(),
      getStartupDetails(id),
      user?.id
        ? safe(() => getProfileData(user.id), null)
        : Promise.resolve(null),
      user?.id && isCollaborator
        ? safe(() => getApplicationsByCollaboratorId(user.id), [])
        : Promise.resolve([]),
    ]);

  const fullUser = profileData?.data || profileData?.user || profileData;

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
        userData={[]}
        initialUser={fullUser ? { ...user, ...fullUser } : user}
        initialAppliedOppIds={initialAppliedOppIds}
      />
    </div>
  );
};

export default StartupDetailsPage;
