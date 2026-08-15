import { getOpportunities } from "@/lib/api/opportunities";
import { getUsersData } from "@/lib/api/users";
import { getStartupDetails } from "@/lib/api/startups";
import { getApplicationsById } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import StartupDetails from "@/components/Startups/StartupDetails";

const StartupDetailsPage = async ({ params }) => {
  const { id } = await params;

  // 1. Fetch startup, opportunity, user session, and applications data in parallel
  const [user, opportunities, userData, startup] = await Promise.all([
    getUserSession(),
    getOpportunities(),
    getUsersData(),
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
