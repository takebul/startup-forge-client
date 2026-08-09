import { getUserSession } from "@/lib/core/session";
import ManageUsersPage from "./ManageUsersPage";
import { getUsersData } from "@/lib/api/users";

const ManageUsersPageWrapper = async () => {
  const All_Users_Data = await getUsersData();
  const currentUser = await getUserSession();

  return (
    <div>
      <ManageUsersPage ALL_USERS={All_Users_Data} currentUser={currentUser} />
    </div>
  );
};

export default ManageUsersPageWrapper;
