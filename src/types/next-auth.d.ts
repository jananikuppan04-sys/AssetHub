import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    departmentId: string | null
  }

  interface Session {
    user: User & DefaultSession["user"]
  }
}
