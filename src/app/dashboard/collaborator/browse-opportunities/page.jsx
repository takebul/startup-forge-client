import { getOpportunities } from "@/lib/api/opportunities";
import { getStartups } from "@/lib/api/startups";
import { getBookmarksById } from "@/lib/api/bookmarks";
import { getApplicationsByCollaboratorId } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import { getProfileData } from "@/lib/api/users";
import BrowseOpportunities from "./BrowseOpportunities";

export const metadata = {
  title: "Explore Opportunities — StartupForge Dashboard",
  description:
    "Discover early-stage startup roles, filter by technical work type and industry domain, and submit collaborative pitches.",
};

const BrowseOpportunitiesPage = async ({ searchParams }) => {
  const query = await searchParams;

  const user = await getUserSession();
  const userId = user?.id || user?._id;

  // Extract filter parameters from URL query
  const search = query?.search || "";
  const workType = query?.workType || "All";
  const industry = query?.industry || "All";
  const page = Math.max(1, Number(query?.page) || 1);
  const limit = Math.max(1, Number(query?.limit) || 4);

  // Fetch ALL real database sources in parallel
  const [opportunities, startups, rawBookmarks, rawApplications, userProfile] =
    await Promise.all([
      getOpportunities({ search, workType, industry, page, limit }),
      getStartups(),
      userId ? getBookmarksById(userId) : [],
      userId ? getApplicationsByCollaboratorId(userId) : [],
      userId ? getProfileData(userId) : null,
    ]);

  // Merge auth session with full MongoDB profile data
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
        startups={startups}
        user={fullUser}
        rawBookmarks={rawBookmarks}
        initialBookmarks={parseBookmarks(rawBookmarks)}
        initialAppliedOppIds={parseAppliedOppIds(rawApplications)}
      />
    </div>
  );
};

export default BrowseOpportunitiesPage;
