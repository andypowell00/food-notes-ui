// middleware.ts
// @ts-nocheck
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"


const DISABLE_AUTH_IN_DEV = process.env.DISABLE_NEXTAUTH_DEV === 'true'

function allowAllMiddleware() {
  return NextResponse.next()
}

const authMiddleware = withAuth(
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

// Export either the auth-enforcing middleware or a passthrough for devs
const middleware = DISABLE_AUTH_IN_DEV ? allowAllMiddleware : authMiddleware

export default middleware

export const config = {
  matcher: [
    // Protect these routes
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
}