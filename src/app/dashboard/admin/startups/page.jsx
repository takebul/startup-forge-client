import { getStartups } from "@/lib/api/startups";
import ManageStartupsPage from "./ManageStartupsPage";

const ManageStartupsPageWrapper = async () => {
  const ALL_STARTUPS = await getStartups();

  return (
    <div>
      <ManageStartupsPage ALL_STARTUPS={ALL_STARTUPS} />
    </div>
  );
};

export default ManageStartupsPageWrapper;
