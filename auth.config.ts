import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
  })],
} satisfies NextAuthConfig