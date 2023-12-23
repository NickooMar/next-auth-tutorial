import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "email",
          placeholder: "Your email",
        },
        name: {
          label: "password:",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await User.findOne({ email: credentials.email })
            .lead()
            .exec();

          if (!foundUser) throw new Error("Invalid credentials");

          const match = await bcrypt.compare(
            credentials.password,
            foundUser.password
          );

          if (!match) throw new Error("Invalid credentials");

          delete foundUser.password;

          foundUser["role"] = "Unverified email";

          return foundUser;
        } catch (error) {
          console.log(error);
        }

        return null;
      },
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
