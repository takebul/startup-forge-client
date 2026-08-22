import { getUserSession } from "@/lib/core/session";
import { getProfileData } from "@/lib/api/users";
import FounderProfileWrapper from "./FounderProfileWrapper";

export const metadata = {
  title: "Founder Profile | StartupForge",
  description:
    "Manage your founder identity, startup credentials, and recruitment profile.",
};

export default async function FounderProfilePage() {
  const sessionUser = await getUserSession();
  const userId = sessionUser?.id || sessionUser?._id;
  const userProfile = userId ? await getProfileData(userId) : null;

  return <FounderProfileWrapper initialUser={userProfile || sessionUser} />;
}
