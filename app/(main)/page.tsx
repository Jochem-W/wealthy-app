import { getServerSession } from "next-auth"
import { SignInButton } from "@/components/SignInButton"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { JoinServerButton } from "@/components/JoinServerButton"
import { Container } from "@/components/Container"
import { SessionInfo } from "@/components/SessionInfo"
import { getSubject } from "@/utils/token"
import { checkMember } from "@/utils/discord"
import Link from "next/link"
import { Suspense } from "react"
import { JetBrains_Mono } from "next/font/google"
import { AsyncDiscordUsername } from "@/components/AsyncDiscordUsername"
import { Drizzle } from "@/utils/clients"
import { inviteesTable, usersTable } from "@/schema"
import { eq } from "drizzle-orm"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const metadata = {
  openGraph: {
    type: "website",
    title: "Suspiciously Wealthy Furries",
    description:
      "You've been invited to join @ZestyLemonss' exclusive Ko-fi server: Suspiciously Wealthy Furries!",
    images: "/icon.png",
  },
  twitter: {
    card: "summary",
  },
}

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const inviter = await getSubject(searchParams["token"])
  if (!inviter) {
    return (
      <Container>
        <p>
          This link expired, has already been used, or is otherwise invalid.
        </p>
      </Container>
    )
  }

  const [userData] = await Drizzle.select()
    .from(usersTable)
    .where(eq(usersTable.discordId, inviter))
    .leftJoin(inviteesTable, eq(inviteesTable.userId, usersTable.id))

  if (!userData || userData.invitee) {
    return (
      <Container>
        <p>
          This link expired, has already been used, or is otherwise invalid.
        </p>
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
            <AsyncDiscordUsername id={inviter}></AsyncDiscordUsername>
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
        <div className={"flex flex-col"}>
          <h2 className={"text-2xl"}>Why is this necessary?</h2>
          <p className={"max-w-[75ch]"}>
            While this system is more complex than sending single-use invite
            links, it allows us to fully automate the invite process. If you
            have any concerns about logging in with Discord on external
            websites, please let the person who invited you know, and we&apos;ll
            work something out for you.
          </p>
        </div>
        <SignInButton></SignInButton>
      </Container>
    )
  }

  return (
    <Container>
      <SessionInfo session={session}></SessionInfo>
      <JoinServerButton joined={await checkMember(session)}></JoinServerButton>
    </Container>
  )
}
