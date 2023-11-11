import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const role = req.nextauth.token.role;
    const url = req.url;

    // Sent to Denied if isnt authorized
    if (pathname.startsWith("/CreateUser") && role != "admin") {
      return NextResponse.rewrite(new URL("/Denied", url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/CreateUser"] }; // Apply middleware to these routes
