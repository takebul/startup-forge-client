import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function DashboardHomePage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/signin");
  } else {
    redirect(`/dashboard/${user?.accountType}`);
  }

  return <>Home</>;
}
