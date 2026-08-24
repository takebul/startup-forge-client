import { getUserSession } from "@/lib/core/session";
import PremiumPage from "./PremiumPage";
import { getPlansById } from "@/lib/api/plans";

export const metadata = {
  title: "Upgrade Plan — StartupForge Collaborator",
  description:
    "Unlock unlimited pitch applications, direct founder messaging, and featured talent visibility.",
};

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

