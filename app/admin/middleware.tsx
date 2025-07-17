import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("crisp_admin_auth")?.value === "true"

  if (!isAuthenticated && request.nextUrl.pathname.startsWith("/admin")) {
    // Redirect to login page if not authenticated and trying to access admin
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*", // Apply middleware to all /admin routes
}
