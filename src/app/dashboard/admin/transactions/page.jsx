import { getSubscriptions } from "@/lib/api/subscriptions";
import TransactionsPage from "./TransactionsPage";

const TransactionsPageWrapper = async () => {
  const subscriptions = await getSubscriptions();

  return (
    <div>
      <TransactionsPage subscriptions={subscriptions} />
    </div>
  );
};

export default TransactionsPageWrapper;
