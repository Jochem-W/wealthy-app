import { RESTJSONErrorCodes, Routes } from "discord-api-types/v10"
import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { getSubject } from "@/utils/token"
import { Variables } from "@/utils/variables"
import { Prisma } from "@/utils/clients"
import { checkMember, Discord } from "@/utils/discord"
import { DateTime } from "luxon"
import { DiscordAPIError } from "@discordjs/rest"

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
      Routes.guildMember(Variables.guildId, member.invitee.discordId),
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
