"use server";

import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Build the authenticated request headers.
export const authHeader = async () => {
  const token = await getUserToken();
  const header = token
    ? {
        authorization: `Bearer ${token}`,
      }
    : {};

  return header;
};

// Send a JSON mutation to the backend.
export const serverMutation = async (path, data, method = "POST") => {
  const uri = `${baseUrl}${path}`;

  const res = await fetch(uri, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  return handleStatusCode(res);
};

// Delete a backend resource.
export const deleteData = async (dataId) => {
  const uri = `${baseUrl}${dataId}`;

  const res = await fetch(uri, {
    method: "DELETE",
  });

  return handleStatusCode(res);
};

// Fetch a public backend resource.
export const serverFetch = async (path) => {
  const uri = `${baseUrl}${path}`;

  const res = await fetch(uri);
  return handleStatusCode(res);
};

// Fetch a protected backend resource.
export const protectedFetch = async (path) => {
  const uri = `${baseUrl}${path}`;

  const res = await fetch(uri, {
    headers: await authHeader(),
  });

  // handle 401, 403

  return handleStatusCode(res);
};

// Handle authentication redirects and decode the response.
const handleStatusCode = (res) => {
  if (res.status === 401) {
    redirect("/unauthorized");
  } else if (res.status === 403) {
    redirect("/forbidden");
  }

  return res.json();
};
