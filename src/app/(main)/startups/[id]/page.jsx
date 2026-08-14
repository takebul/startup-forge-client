import { getOpportunities } from "@/lib/api/opportunities";
import StartupDetails from "./StartupDetails";
import { getUsersData } from "@/lib/api/users";
import { getStartupDetails } from "@/lib/api/startups";

const StartupDetailsPage = async ({ params }) => {
  const { id } = await params;
  const opportunities = await getOpportunities();
  const userData = await getUsersData();
  const startup = await getStartupDetails(id);

  console.log({ opportunities, userData, startup });

  return (
    <div>
      <StartupDetails
        opportunities={opportunities}
        userData={userData}
        startups={startup}
      />
    </div>
  );
};

export default StartupDetailsPage;
