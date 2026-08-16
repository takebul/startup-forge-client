import React from "react";
import MyApplications from "./MyApplications";
import { getApplicationsByCollaboratorId } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";

const MyApplicationsPage = async () => {
  const user = await getUserSession();
  const myApplications = await getApplicationsByCollaboratorId(user?.id);
  return (
    <div>
      <MyApplications myApplications={myApplications} />
    </div>
  );
};

export default MyApplicationsPage;
