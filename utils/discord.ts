import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { Routes } from "discord-api-types/v10"
import { Variables } from "@/utils/variables"
import { REST } from "@discordjs/rest"
import { APIGuildMember, APIUser } from "discord-api-types/v10"

const globalForDiscord = global as unknown as { discord: REST | undefined }
export const Discord =
  globalForDiscord.discord ??
  new REST({ version: "10" }).setToken(Variables.discordBotToken)

export async function checkMember(existingSession?: Session) {
  const session = existingSession ?? (await getServerSession(Options))
  if (!session?.user) {
    return false
  }

  try {
    await Discord.get(Routes.guildMember(Variables.guildId, session.user.id))
  } catch (e) {
    return false
  }

  return true
}

if (process.env.NODE_ENV !== "production") {
  globalForDiscord.discord = Discord
}

export type MemberWithUser = APIGuildMember & { user: APIUser }
export type MembersResponse = MemberWithUser[]

export function discordTag(member: MemberWithUser) {
  return `${member.user.username}#${member.user.discriminator}`
}

function avatarPath(avatar: string) {
  if (avatar.startsWith("a_")) {
    return `${avatar}.gif`
  }

  return `${avatar}.webp`
}

export function avatarUrl(member: MemberWithUser) {
  if (member.avatar) {
    return `https://cdn.discordapp.com/guilds/${Variables.guildId}/users/${
      member.user.id
    }/avatars/${avatarPath(member.avatar)}`
  }

  if (member.user.avatar) {
    return `https://cdn.discordapp.com/avatars/${member.user.id}/${avatarPath(
      member.user.avatar
    )}`
  }

  return `https://cdn.discordapp.com/embed/avatars/${
    parseInt(member.user.discriminator, 10) % 5
  }.png`
}
