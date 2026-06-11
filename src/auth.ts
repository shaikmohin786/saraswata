import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import crypto from "crypto";
import { getUserByEmail } from "@/lib/db/queries/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user || user.UserDelete !== 0) return null;
        if (user.UserStatus !== 0) return null;

        const md5 = crypto.createHash("md5").update(password).digest("hex");
        if (user.UserPassword !== md5) return null;

        return {
          id: String(user.UserID),
          name: `${user.UserFirstName} ${user.UserLastName}`.trim(),
          email: user.UserEmailID,
          role: user.UserRole,
          image: user.UserProfilePic || null,
        };
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: number }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: number }).role = token.role as number;
      }
      return session;
    },
  },
  trustHost: true,
});
