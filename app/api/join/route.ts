import { Routes } from "discord-api-types/v10"
import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { getInviter } from "@/utils/token"
import { Variables } from "@/utils/variables"
import { Prisma } from "@/utils/clients"
import { REST } from "@discordjs/rest"
import { checkMember } from "@/utils/discord"

const discord = new REST({ version: "10" }).setToken(Variables.discordBotToken)

async function transferInvite(inviter: string, session: Session) {
  const user = await Prisma.user.findFirstOrThrow({
    where: { discordId: inviter },
    include: { invitee: true },
  })

  // Member has a spare invite
  if (!user.invitee) {
    const invitee = await Prisma.invitee.findFirst({
      where: { discordId: session.user.id },
    })

    // User has already been invited
    if (invitee) {
      return
    }

    // User hasn't been invited yet
    await Prisma.invitee.create({
      data: {
        discordId: session.user.id,
        user: { connect: { discordId: inviter } },
      },
    })
    return
  }

  // Member already invited the user
  if (user.invitee.discordId === session.user.id) {
    return
  }

  // Member invited a different user first
  await discord.delete(
    Routes.guildMember(Variables.guildId, user.invitee.discordId)
  )
  await Prisma.invitee.delete({ where: { discordId: user.invitee.discordId } })
  await Prisma.invitee.create({
    data: {
      discordId: session.user.id,
      user: { connect: { discordId: inviter } },
    },
  })
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const inviter = await getInviter(token)
  if (!inviter) {
    return new Response("Invalid token", { status: 403 })
  }

  if (await checkMember()) {
    return new Response("Server joined!", { status: 200 })
  }

  const session = await getServerSession(Options)
  if (!session?.user) {
    return new Response("Invalid session", { status: 403 })
  }

  try {
    await transferInvite(inviter, session)
  } catch (e) {
    console.log(e)
    return new Response("Couldn't transfer invite", { status: 500 })
  }

  await discord.put(Routes.guildMember(Variables.guildId, session.user.id), {
    body: { access_token: session.user.accessToken },
  })

  return new Response("Server joined!", { status: 200 })
}
