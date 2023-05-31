import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    discriminator: string
    accessToken: string
  }

  interface Profile {
    id: string
    discriminator: string
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    id: string
    discriminator: string
  }
}
