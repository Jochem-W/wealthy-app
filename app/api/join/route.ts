import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"
import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { getInviter } from "@/utils/token"
import { Variables } from "@/utils/variables"

const rest = new REST({ version: "10" }).setToken(Variables.discordBotToken)
const prisma = new PrismaClient()
const guildId = Variables.guildId

async function transferInvite(inviter: string, session: Session) {
  const user = await prisma.user.findFirstOrThrow({
    where: { discordId: inviter },
    include: { invitee: true },
  })

  // Member has a spare invite
  if (!user.invitee) {
    const invitee = await prisma.invitee.findFirst({
      where: { discordId: session.user.id },
    })

    // User has already been invited
    if (invitee) {
      return
    }

    // User hasn't been invited yet
    await prisma.invitee.create({
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
  await rest.delete(Routes.guildMember(guildId, user.invitee.discordId))
  await prisma.invitee.delete({ where: { discordId: user.invitee.discordId } })
  await prisma.invitee.create({
    data: {
      discordId: session.user.id,
      user: { connect: { discordId: inviter } },
    },
  })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const inviter = await getInviter(token)
  if (!inviter) {
    return new Response("Invalid token", { status: 403 })
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

  // const response = (await rest.put(
  //   Routes.guildMember(guildId, session.user.id),
  //   {
  //     body: { access_token: session.user.accessToken },
  //   }
  // )) as RESTPutAPIGuildMemberResult

  await rest.put(Routes.guildMember(guildId, session.user.id), {
    body: { access_token: session.user.accessToken },
  })

  return new Response("Server joined!", { status: 200 })
}
