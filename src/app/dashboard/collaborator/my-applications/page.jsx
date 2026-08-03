import React from "react";
import MyApplications from "./MyApplications";
import { getApplicationsById } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";

const MyApplicationsPage = async () => {
  const user = await getUserSession();
  const myApplications = await getApplicationsById(user?.id);
  return (
    <div>
      <MyApplications myApplications={myApplications} />
    </div>
  );
};

export default MyApplicationsPage;
