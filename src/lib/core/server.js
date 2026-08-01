"use server";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const serverMutation = async (path, data, method = "POST") => {
  const uri = `${baseUrl}${path}`;

  const res = await fetch(uri, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleStatusCode(res);
};

export const deleteData = async (dataId) => {
  const uri = `${baseUrl}${dataId}`;

  const res = await fetch(uri, {
    method: "DELETE",
  });

  return handleStatusCode(res);
};

export const serverFetch = async (path) => {
  const uri = `${baseUrl}${path}`;

  const res = await fetch(uri);
  return handleStatusCode(res);
};

const handleStatusCode = (res) => {
  if (res.status === 401) {
    redirect("/unauthorized");
  } else if (res.status === 403) {
    redirect("/forbidden");
  }

  return res.json();
};
