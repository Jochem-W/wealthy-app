import { getServerSession } from "next-auth"
import { SignInButton } from "@/components/SignInButton"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { JoinServerButton } from "@/components/JoinServerButton"
import { Container } from "@/components/Container"
import { SessionInfo } from "@/components/SessionInfo"
import { getInviter } from "@/utils/token"

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  if (!(await getInviter(searchParams["token"]))) {
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
