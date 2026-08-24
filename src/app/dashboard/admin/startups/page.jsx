import { getStartups } from "@/lib/api/startups";
import ManageStartupsPage from "./ManageStartupsPage";

export const metadata = {
  title: "Startup Review Pipeline — StartupForge Admin",
  description:
    "Review, approve, or reject newly registered startups before they are publicly listed on the ecosystem.",
};

const ManageStartupsPageWrapper = async () => {
  const ALL_STARTUPS = await getStartups();

  return (
    <div>
      <ManageStartupsPage ALL_STARTUPS={ALL_STARTUPS} />
    </div>
  );
};

export default ManageStartupsPageWrapper;

