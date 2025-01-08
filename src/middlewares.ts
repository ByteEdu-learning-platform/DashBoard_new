import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  //!The middleware function will only be invoked if the authorized callback returns true.

  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        //allow webhook routes
        if (pathname.startsWith("/api/webhook")) return true;

        //allow auth routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register")
        ) {
          return true;
        }

        //allow products routes
        if (
          pathname.startsWith("/") ||
          pathname.startsWith("/api/products") ||
          pathname.startsWith("/products")
        ) {
          return true;
        }

        //allow admin routes
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
