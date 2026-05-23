import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isProtected = request.nextUrl.pathname.startsWith("/saved");
      return !isProtected || Boolean(session?.user);
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
