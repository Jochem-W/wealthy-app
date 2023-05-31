import { REST } from "@discordjs/rest"
import { RESTPutAPIGuildMemberResult, Routes } from "discord-api-types/v10"
import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { getInviter } from "@/utils/token"

const rest = new REST({ version: "10" }).setToken(
  process.env["DISCORD_BOT_TOKEN"] as string
)
const prisma = new PrismaClient()
const guildId = process.env["GUILD_ID"] as string

async function kickOld(inviter: string, session: Session) {
  const user = await prisma.user.findFirstOrThrow({
    where: { discordId: inviter },
    include: { invitee: true },
  })

  if (!user.invitee) {
    return
  }

  if (user.invitee.discordId === session.user.id) {
    return
  }

  await rest.delete(Routes.guildMember(guildId, user.invitee.discordId))
  await prisma.invitee.delete({ where: { discordId: user.invitee.discordId } })
}

async function writeNew(inviter: string, session: Session) {
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
    return new Response(null, { status: 403, statusText: "Invalid token" })
  }

  const session = await getServerSession(Options)
  if (!session?.user) {
    return new Response(null, { status: 403, statusText: "Invalid session" })
  }

  try {
    await kickOld(inviter, session)
    await writeNew(inviter, session)
  } catch (e) {
    console.log(e)
    return new Response(null, {
      status: 500,
      statusText: "Couldn't transfer invite",
    })
  }

  const response = (await rest.put(
    Routes.guildMember(guildId, session.user.id),
    {
      body: { access_token: session.user.accessToken },
    }
  )) as RESTPutAPIGuildMemberResult

  return new Response(null, { status: 200 })
}
