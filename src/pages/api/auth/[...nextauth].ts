import NextAuth, {type NextAuthOptions} from "next-auth";

import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {prisma} from "../../../server/db/client";
import {env} from "../../../env/server.mjs";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({session, user}) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: "env.GITHUB_CLIENT_ID",
      clientSecret: "env.GITHUB_CLIENT_SECRET",
    }),
  ],
};

export default NextAuth(authOptions);
