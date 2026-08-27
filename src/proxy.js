import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

// Protect free-plan users from accessing premium profile routes.
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    session?.user?.plan === "founder_free" ||
    session?.user?.plan === "collaborator_free"
  ) {
    const signinUrl = new URL("/pricing", request.url);

    signinUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(signinUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile"],
};
