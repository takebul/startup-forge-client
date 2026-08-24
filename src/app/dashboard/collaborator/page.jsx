import { getUserSession } from "@/lib/core/session";
import CollaboratorDashboardPage from "./CollaboratorDashboardPage";
import { getApplicationsByCollaboratorId } from "@/lib/api/applications";
import { getBookmarksById } from "@/lib/api/bookmarks";

export const metadata = {
  title: "Collaborator Overview — StartupForge Dashboard",
  description:
    "Track your active applications, review application statuses, and manage saved opportunity bookmarks.",
};

const CollaboratorDashboardPageWrapper = async () => {
  const user = await getUserSession();
  const myApplications = await getApplicationsByCollaboratorId(user?.id);
  const bookmarks = await getBookmarksById(user?.id);

  return (
    <div>
      <CollaboratorDashboardPage
        user={user}
        myApplications={myApplications}
        bookmarks={bookmarks}
      />
    </div>
  );
};

export default CollaboratorDashboardPageWrapper;

