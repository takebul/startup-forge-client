import { getOpportunities } from "@/lib/api/opportunities";
import { getUsersData } from "@/lib/api/users";
import { getStartupDetails } from "@/lib/api/startups";
import { getApplicationsById } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import StartupDetails from "@/components/Startups/StartupDetails";

const StartupDetailsPage = async ({ params }) => {
  const { id } = await params;

  // 1. Fetch user session first to determine role
  const user = await getUserSession();

  const resolvedRole =
    user?.role === "admin"
      ? "admin"
      : user?.accountType || (user?.role !== "user" ? user?.role : null);

  // 2. Fetch opportunity details, startups, and conditionally users data
  const [opportunities, userData, startup] = await Promise.all([
    getOpportunities(),
    resolvedRole === "admin" ? getUsersData() : Promise.resolve([]),
    getStartupDetails(id),
  ]);

  // 2. Fetch logged-in collaborator's existing applications
  const userApplications = user?.id ? await getApplicationsById(user.id) : [];

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
        initialAppliedOppIds={initialAppliedOppIds}
      />
    </div>
  );
};

export default StartupDetailsPage;
