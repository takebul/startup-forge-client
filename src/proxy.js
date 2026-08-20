import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

// This function can be marked `async` if using `await` inside
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // console.log(session);

  if (
    session?.user?.plan === "founder_free" ||
    session?.user?.plan === "collaborator_free"
  ) {
    // return NextResponse.redirect(new URL("/pricing", request.url));

    const signinUrl = new URL("/pricing", request.url);

    signinUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(signinUrl);
  }
  return NextResponse.next();

  // if (!session) {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  // return NextResponse.redirect(new URL("/signin", request.url));
}

export const config = {
  matcher: ["/profile"],
};

// {
//   import { NextResponse } from "next/server";
// import { auth } from "./lib/auth";
// import { headers } from "next/headers";

// export async function proxy(request) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     const loginUrl = new URL("/login", request.url);

//     loginUrl.searchParams.set(
//       "callbackUrl",
//       request.nextUrl.pathname + request.nextUrl.search,
//     );

//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/tutors/:path",
//     "/addTutor",
//     "/myTutors",
//     "/bookedSessions",
//     "/profile",
//   ],
// };

// }
