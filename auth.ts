import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Guest Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@example.com" },
      },
      async authorize(credentials) {
        // Safe mock authorization for local development & demonstration
        const email = (credentials?.email as string) || "guest@example.com";
        const name = email.split("@")[0];
        
        // Capitalize guest name
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);
        
        return {
          id: "guest-user-id",
          name: displayName,
          email: email,
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
});
