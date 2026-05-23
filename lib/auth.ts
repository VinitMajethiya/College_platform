import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";

import { prisma } from "@/lib/prisma";

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
  }),
  ...(process.env.EMAIL_SERVER
    ? [
        Nodemailer({
          server: process.env.EMAIL_SERVER,
          from: process.env.EMAIL_FROM ?? "noreply@collegecompass.app"
        })
      ]
    : [])
];

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database"
  },
  pages: {
    signIn: "/auth/signin"
  },
  providers,
  callbacks: {
    authorized({ auth: session, request }) {
      const isProtected = request.nextUrl.pathname.startsWith("/saved");
      return !isProtected || Boolean(session?.user);
    }
  }
});
