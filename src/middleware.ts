// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null
    },
    pages: {
      signIn: '/login'
    }
  }
)

export const config = {
  matcher: [
    // Protect these routes
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
}