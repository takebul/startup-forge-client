import { getStartups } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import StartupsPage from "@/components/Startups/StartupsPage";

const StartupsPageWrapper = async () => {
  const startups = await getStartups();
  const opportunities = await getOpportunities();

  return (
    <div>
      <StartupsPage startups={startups} opportunities={opportunities} />
    </div>
  );
};

export default StartupsPageWrapper;
