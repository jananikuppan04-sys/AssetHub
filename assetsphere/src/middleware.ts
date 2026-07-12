import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    
    // Protect organization setup (Admin only)
    if (path.startsWith("/dashboard/organization") && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
    // Prevent non-admins from accessing certain user management endpoints if any
    if (path.startsWith("/api/admin") && token?.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 403 })
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: "/login",
    }
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/:path*"
  ],
}
