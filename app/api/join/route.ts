import { Routes } from "discord-api-types/v10"
import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { getInviter } from "@/utils/token"
import { Variables } from "@/utils/variables"
import { Prisma } from "@/utils/clients"
import { checkMember, Discord } from "@/utils/discord"
import { DateTime } from "luxon"

async function transferInvite(inviter: string, session: Session) {
  const invitee = await Prisma.invitee.findFirst({
    where: { discordId: session.user.id },
  })

  // User was already invited
  if (invitee) {
    return
  }

  const member = await Prisma.user.findFirstOrThrow({
    where: { discordId: inviter },
    include: { invitee: true },
  })

  // Member has a spare invite
  if (!member.invitee) {
    await Prisma.invitee.create({
      data: {
        discordId: session.user.id,
        user: { connect: { discordId: inviter } },
      },
    })
    return
  }

  // Member invited a different user first
  const toKick = await Prisma.user.findFirst({
    where: {
      discordId: member.invitee.discordId,
      lastPaymentTime: {
        gte: DateTime.now()
          .minus({ days: 30 + Variables.gracePeriod })
          .toJSDate(),
      },
    },
  })
  if (!toKick) {
    await Discord.delete(
      Routes.guildMember(Variables.guildId, member.invitee.discordId)
    )
  }
  await Prisma.invitee.delete({
    where: { discordId: member.invitee.discordId },
  })
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

  await Discord.put(Routes.guildMember(Variables.guildId, session.user.id), {
    body: { access_token: session.user.accessToken },
  })

  return new Response("Server joined", { status: 200 })
}
