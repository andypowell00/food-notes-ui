import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const expectedUsername = process.env.APP_USERNAME
        const encodedHash = process.env.APP_PASSWORD_HASH;
        if (!encodedHash) {
            throw new Error('Password hash is not configured');
        }
        
        const expectedPasswordHash = Buffer.from(encodedHash, 'base64').toString()

        if (!expectedUsername || !expectedPasswordHash) {
          return null
        }

        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const isUsernameMatch = credentials.username === expectedUsername
          const isPasswordMatch = await compare(credentials.password, expectedPasswordHash)

          if (isUsernameMatch && isPasswordMatch) {
            return { id: "1", name: credentials.username }
          }

          return null
        } catch (error) {
          console.error('Error during login:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
      }
      return session
    }
  },
  debug: false  // Disable debug mode for production
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }