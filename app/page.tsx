import { getServerSession } from "next-auth"
import { SignInButton } from "@/components/SignInButton"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { JoinServerButton } from "@/components/JoinServerButton"
import { Container } from "@/components/Container"
import { SessionInfo } from "@/components/SessionInfo"
import { getInviter } from "@/utils/token"
import { checkMember, Discord } from "@/utils/discord"
import Link from "next/link"
import { RESTGetAPIUserResult, Routes } from "discord-api-types/v10"
import { JetBrains_Mono } from "next/font/google"
import { Suspense } from "react"

const mono = JetBrains_Mono({ subsets: ["latin"] })

const UserSpan = async ({ id }: { id: string }) => {
  const response = (await Discord.get(Routes.user(id))) as RESTGetAPIUserResult

  return (
    <span className={mono.className}>
      {response.username}#{response.discriminator}
    </span>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const inviter = await getInviter(searchParams["token"])
  if (!inviter) {
    return (
      <Container>
        <p>Invalid token</p>
      </Container>
    )
  }

  const session = await getServerSession(Options)

  if (session === null) {
    return (
      <Container>
        <p className={"max-w-[75ch]"}>
          You&apos;ve been invited by{" "}
          <Suspense fallback={<span className={mono.className}>someone</span>}>
            {/* @ts-expect-error Async Server Component */}
            <UserSpan id={inviter}></UserSpan>
          </Suspense>{" "}
          to join{" "}
          <Link
            href={"https://twitter.com/ZestyLemonss"}
            className={"underline transition-colors hover:text-blue-500"}
          >
            @ZestyLemonss
          </Link>
          &apos; exclusive Ko-fi server: Suspiciously Wealthy Furries! Please
          click the button below to sign in using Discord and join the server.
        </p>
        <SignInButton></SignInButton>
      </Container>
    )
  }

  return (
    <Container>
      <SessionInfo session={session}></SessionInfo>
      <JoinServerButton joined={await checkMember()}></JoinServerButton>
    </Container>
  )
}
