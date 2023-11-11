import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        console.log({ GithubProfile: profile });

        let userRole = "GitHub User";

        if (profile?.email === "nicoo.marsili@gmail.com") {
          userRole = "admin";
        }

        return { ...profile, role: userRole };
      },
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      profile(profile) {
        console.log({ GoogleProfile: profile });

        let userRole = "Google User";

        return { ...profile, id: profile.sub, role: userRole };
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.role) session.user.role = token.role;
      return session;
    },
  },
};
