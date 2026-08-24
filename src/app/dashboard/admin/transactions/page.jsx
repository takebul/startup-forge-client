import { getSubscriptions } from "@/lib/api/subscriptions";
import TransactionsPage from "./TransactionsPage";

export const metadata = {
  title: "Transactions & Payments — StartupForge Admin",
  description:
    "Track all Stripe customer transactions, subscription purchases, invoices, and payment receipts.",
};

const TransactionsPageWrapper = async () => {
  const subscriptions = await getSubscriptions();

  return (
    <div>
      <TransactionsPage subscriptions={subscriptions} />
    </div>
  );
};

export default TransactionsPageWrapper;

