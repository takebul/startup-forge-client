import { getOpportunities } from "@/lib/api/opportunities";
import { getBookmarksById } from "@/lib/api/bookmarks";
import { getApplicationsByCollaboratorId } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import { getProfileData } from "@/lib/api/users";
import BrowseOpportunities from "./BrowseOpportunities";

const BrowseOpportunitiesPage = async () => {
  const user = await getUserSession();
  const userId = user?.id || user?._id;

  // Fetch ALL 4 data sources in parallel for maximum speed
  const [opportunities, rawBookmarks, rawApplications, userProfile] =
    await Promise.all([
      getOpportunities(),
      userId ? getBookmarksById(userId) : [],
      userId ? getApplicationsByCollaboratorId(userId) : [],
      userId ? getProfileData(userId) : null,
    ]);

  // 🔥 MERGE auth session with full MongoDB profile data (includes skills & bio)
  const fullUser = {
    ...user,
    ...userProfile,
  };

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
    return list.map((app) => String(app.opportunityId)).filter(Boolean);
  };

  return (
    <div>
      <BrowseOpportunities
        opportunitiesData={opportunities}
        user={fullUser} // <-- FIX: Passing fullUser with skills & bio
        initialBookmarks={parseBookmarks(rawBookmarks)}
        initialAppliedOppIds={parseAppliedOppIds(rawApplications)}
      />
    </div>
  );
};

export default BrowseOpportunitiesPage;
