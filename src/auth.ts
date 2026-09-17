import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "kayla@kaylathecreateher.com";
const DEMO_PASSWORD = "createher2026";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "kayla-createher-dev-secret-set-AUTH_SECRET-in-vercel",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase().trim();
        const password = credentials?.password?.toString() ?? "";
        if (!email || !password) return null;

        try {
          let user = await prisma.user.findUnique({ where: { email } });

          // Bootstrap demo owner on a fresh database (first deploy / empty seed).
          if (!user && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
            const count = await prisma.user.count();
            if (count === 0) {
              user = await prisma.user.create({
                data: {
                  email: DEMO_EMAIL,
                  name: "Kayla",
                  passwordHash: await hash(DEMO_PASSWORD, 10),
                  role: "owner",
                },
              });
            }
          }

          if (!user) return null;

          const valid = await compare(password, user.passwordHash);
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[auth] authorize failed", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
