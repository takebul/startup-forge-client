import { getOpportunities } from "@/lib/api/opportunities";
import StartupDetails from "./StartupDetails";
import { getUsersData } from "@/lib/api/users";
import { getStartupDetails } from "@/lib/api/startups";

const StartupDetailsPage = async ({ params }) => {
  const { id } = await params;
  const opportunities = await getOpportunities();
  const userData = await getUsersData();
  const startups = await getStartupDetails(id);

  console.log({ opportunities, userData, startups });

  return (
    <div>
      <StartupDetails
        opportunities={opportunities}
        userData={userData}
        startups={startups}
      />
    </div>
  );
};

export default StartupDetailsPage;
