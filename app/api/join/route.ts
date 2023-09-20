import { Routes } from "discord-api-types/v10"
import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { getSubject } from "@/utils/token"
import { Variables } from "@/utils/variables"
import { checkMember, Discord } from "@/utils/discord"
import { DiscordAPIError } from "@discordjs/rest"
import { Drizzle } from "@/utils/clients"
import { inviteesTable, usersTable } from "@/schema"
import { eq } from "drizzle-orm"

async function transferInvite(inviter: string, session: Session) {
  const [memberData] = await Drizzle.select()
    .from(usersTable)
    .where(eq(usersTable.discordId, inviter))
    .leftJoin(inviteesTable, eq(inviteesTable.userId, usersTable.id))

  // Member not found or has already invited someone
  if (!memberData || memberData.invitee) {
    throw new Error("Invalid invite link")
  }

  const [invitee] = await Drizzle.select()
    .from(inviteesTable)
    .where(eq(inviteesTable.discordId, session.user.id))

  // User was already invited
  if (invitee) {
    return
  }

  await Drizzle.insert(inviteesTable).values({
    discordId: session.user.id,
    userId: memberData.user.id,
  })
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const inviter = await getSubject(token)
  if (!inviter) {
    return new Response("Invalid token", { status: 403 })
  }

  const session = await getServerSession(Options)
  if (!session?.user) {
    return new Response("Invalid session", { status: 403 })
  }

  if (await checkMember(session)) {
    return new Response("Server joined", { status: 200 })
  }

  try {
    await transferInvite(inviter, session)
  } catch (e) {
    console.log(e)
    return new Response("Couldn't transfer invite", { status: 500 })
  }

  try {
    await Discord.put(Routes.guildMember(Variables.guildId, session.user.id), {
      body: {
        access_token: session.user.accessToken,
        roles: [Variables.inviteeRole],
      },
    })
  } catch (e) {
    console.error(e)
    if (!(e instanceof DiscordAPIError)) {
      if (!(e instanceof Error)) {
        return new Response("Unknown error", { status: 500 })
      }

      return new Response(`Error: ${e.name}`, { status: 500 })
    }

    return new Response(e.message, { status: 500 })
  }

  return new Response("Server joined", { status: 200 })
}
