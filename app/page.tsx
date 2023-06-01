import { getServerSession } from "next-auth"
import { SignInButton } from "@/components/SignInButton"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import Image from "next/image"
import { SignOutButton } from "@/components/SignOutButton"
import { JoinServerButton } from "@/components/JoinServerButton"
import { Container } from "@/components/Container"
import { JetBrains_Mono } from "next/font/google"
import { jwtDecrypt, jwtVerify, SignJWT } from "jose"
import { createSecretKey } from "crypto"
import { SessionInfo } from "@/components/SessionInfo"
import { getInviter } from "@/utils/token"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const token = searchParams["token"]
  if (!(await getInviter(searchParams["token"]))) {
    return (
      <Container>
        <p>Invalid token</p>
      </Container>
    )
  }

  const session = await getServerSession(Options)

  if (session === null || !session.user) {
    return (
      <Container>
        <p className={"max-w-[75ch]"}>
          You&apos;ve been invited to join Lemon&apos;s exclusive Ko-fi server:
          Suspiciously Wealthy Furries! Please click the button below to sign in
          using Discord and join the server.
        </p>
        <SignInButton></SignInButton>
      </Container>
    )
  }

  return (
    <Container>
      <SessionInfo session={session}></SessionInfo>
      <JoinServerButton></JoinServerButton>
    </Container>
  )
}
