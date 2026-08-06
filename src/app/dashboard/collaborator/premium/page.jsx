import { getUserSession } from "@/lib/core/session";
import PremiumPage from "./PremiumPage";
import { getPlansById } from "@/lib/api/plans";

const PremiumPageWrapper = async () => {
  const user = await getUserSession();

  // Fetch plans from server API or fallback
  const plansData = await getPlansById(user?.plan || "collaborator_free");

  return (
    <div>
      <PremiumPage user={user} plansData={plansData} />
    </div>
  );
};

export default PremiumPageWrapper;
