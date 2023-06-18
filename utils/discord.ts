import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { APIGuildMember, APIUser, Routes } from "discord-api-types/v10"
import { Variables } from "@/utils/variables"
import { REST } from "@discordjs/rest"

export type MemberWithUser = APIGuildMember & { user: APIUser }
export type MembersResponse = MemberWithUser[]

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

export function displayAvatarUrl(member: MemberWithUser) {
  if (member.avatar) {
    return Discord.cdn.guildMemberAvatar(
      Variables.guildId,
      member.user.id,
      member.avatar
    )
  }

  if (member.user.avatar) {
    return Discord.cdn.avatar(member.user.id, member.user.avatar)
  }

  return Discord.cdn.defaultAvatar(parseInt(member.user.discriminator, 10))
}

export function userDisplayName(user: APIUser) {
  if (user.global_name) {
    return user.global_name
  }

  return user.username
}
