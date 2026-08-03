import { getOpportunities } from "@/lib/api/opportunities";
import { getBookmarksById } from "@/lib/api/bookmarks";
import { getApplicationsById } from "@/lib/api/applications"; // Function fetching /api/my/applications
import { getUserSession } from "@/lib/core/session";
import BrowseOpportunities from "./BrowseOpportunities";

const BrowseOpportunitiesPage = async () => {
  const user = await getUserSession();

  // Fetch all 3 data sources in parallel
  const [opportunities, rawBookmarks, rawApplications] = await Promise.all([
    getOpportunities(),
    user?.id ? getBookmarksById(user?.id) : [],
    user?.id ? getApplicationsById(user?.id) : [],
  ]);

  // Normalize Bookmarks to IDs array
  const parseBookmarks = (data) => {
    const list = Array.isArray(data) ? data : data?.data || [];
    return list.map((b) =>
      typeof b === "string" ? b : b.opportunityId || b._id || b.id,
    );
  };

  // Extract Opportunity IDs user has already applied to
  const parseAppliedOppIds = (data) => {
    const list = Array.isArray(data) ? data : data?.data || [];
    return list.map((app) => app.opportunityId).filter(Boolean);
  };

  return (
    <div>
      <BrowseOpportunities
        opportunitiesData={opportunities}
        user={user}
        initialBookmarks={parseBookmarks(rawBookmarks)}
        initialAppliedOppIds={parseAppliedOppIds(rawApplications)}
      />
    </div>
  );
};

export default BrowseOpportunitiesPage;
