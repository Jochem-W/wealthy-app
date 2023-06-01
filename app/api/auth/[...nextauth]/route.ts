import NextAuth, { AuthOptions } from "next-auth"
import Discord from "next-auth/providers/discord"
import { Variables } from "@/utils/variables"

export const Options: AuthOptions = {
  callbacks: {
    jwt({ token, account, profile }) {
      if (profile) {
        console.log(profile)
        token.id = profile.id
        token.discriminator = profile.discriminator
      }

      if (account?.access_token) {
        token.accessToken = account.access_token
      }

      return token
    },
    session({ session, token }) {
      if (!session.user) {
        console.log("SDFSDFSDFSD\nSDFSDFSDFSD\nSDFSDFSDFSD\nSDFSDFSDFSD\n")
        return session
      }

      session.user.id = token.id
      session.user.discriminator = token.discriminator
      session.user.accessToken = token.accessToken

      return session
    },
  },
  providers: [
    Discord({
      authorization: {
        params: {
          scope: "guilds.join identify",
        },
      },
      clientId: Variables.clientId,
      clientSecret: Variables.clientSecret,
    }),
  ],
  session: { strategy: "jwt" },
}

const handler = NextAuth(Options) as unknown

export { handler as GET, handler as POST }
