import MyApplications from "./MyApplications";
import { getApplicationsByCollaboratorId } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "My Applications — StartupForge Dashboard",
  description:
    "Track all submitted applications, review feedback from startup founders, and view real-time status updates.",
};

const MyApplicationsPage = async () => {
  const user = await getUserSession();
  const myApplications = await getApplicationsByCollaboratorId(user?.id);
  return (
    <div>
      <MyApplications myApplications={myApplications} />
    </div>
  );
};

export default MyApplicationsPage;

