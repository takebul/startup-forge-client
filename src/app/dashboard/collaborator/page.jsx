import { getUserSession } from "@/lib/core/session";
import CollaboratorDashboardPage from "./CollaboratorDashboardPage";

const CollaboratorDashboardPageWrapper = async () => {
  const user = await getUserSession();

  return (
    <div>
      <CollaboratorDashboardPage user={user} />
    </div>
  );
};

export default CollaboratorDashboardPageWrapper;
