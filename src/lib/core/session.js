import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

export const getUserToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.token || null;
};

export const requireAccountType = async (accountType) => {
  const user = await getUserSession();
  if (!user) {
    redirect("/signin");
  }
  if (user?.accountType !== accountType) {
    redirect("/unauthorized");
  }
  return user;
};
