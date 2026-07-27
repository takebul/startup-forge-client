import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

// This function can be marked `async` if using `await` inside
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);

  // if (session?.user?.plan === "free") {
  //   return NextResponse.redirect(new URL("/pricing", request.url));
  // }

  // if (!session) {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  return NextResponse.redirect(new URL("/signin", request.url));
}

export const config = {
  matcher: ["/profile"],
};
