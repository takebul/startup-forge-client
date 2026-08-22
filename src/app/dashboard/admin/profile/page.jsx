import { getUserSession } from "@/lib/core/session";
import { getProfileData } from "@/lib/api/users";
import AdminProfileWrapper from "./AdminProfileWrapper";

export const metadata = {
  title: "Admin Profile | StartupForge",
  description:
    "Manage your administrator profile and platform governance settings.",
};

export default async function AdminProfilePage() {
  const sessionUser = await getUserSession();
  const userId = sessionUser?.id || sessionUser?._id;
  const userProfile = userId ? await getProfileData(userId) : null;

  return <AdminProfileWrapper initialUser={userProfile || sessionUser} />;
}
