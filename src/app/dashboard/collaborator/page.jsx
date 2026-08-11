import { getUserSession } from "@/lib/core/session";
import CollaboratorDashboardPage from "./CollaboratorDashboardPage";
import { getApplicationsById } from "@/lib/api/applications";
import { getBookmarksById } from "@/lib/api/bookmarks";

const CollaboratorDashboardPageWrapper = async () => {
  const user = await getUserSession();
  const myApplications = await getApplicationsById(user?.id);
  const bookmarks = await getBookmarksById(user?.id);

  console.log({ user, myApplications, bookmarks });

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
