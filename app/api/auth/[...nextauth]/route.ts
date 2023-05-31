import NextAuth, { AuthOptions } from "next-auth"
import Discord from "next-auth/providers/discord"

export const Options: AuthOptions = {
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (profile) {
        console.log(profile)
        token.id = profile.id
        token.discriminator = profile.discriminator
      }

      if (account && account.access_token) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.discriminator = token.discriminator
        session.user.accessToken = token.accessToken
      }
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
      clientId: "1106267397985423440",
      clientSecret: "31t_6_2qTmFD1UlW_nMPu5IzNuWHraXk",
    }),
  ],
  session: { strategy: "jwt" },
}

const handler = NextAuth(Options)

export { handler as GET, handler as POST }
