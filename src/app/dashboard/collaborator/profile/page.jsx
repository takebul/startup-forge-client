import { getUserSession } from "@/lib/core/session";
import ProfilePageWrapper from "./ProfilePageWrapper";
import { getProfileData } from "@/lib/api/users";

export const metadata = {
  title: "Profile & Portfolio — StartupForge Collaborator",
  description:
    "Update your professional bio, primary skillsets, portfolio links, GitHub, and resume details.",
};

const ProfilePage = async () => {
  const sessionUser = await getUserSession();
  const userId = sessionUser?.id || sessionUser?._id;
  const userProfile = userId ? await getProfileData(userId) : null;

  return <ProfilePageWrapper initialUser={userProfile || sessionUser} />;
};

export default ProfilePage;

