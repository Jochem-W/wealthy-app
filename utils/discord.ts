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

export function displayAvatarUrl(user: APIUser) {
  if (user.avatar) {
    return Discord.cdn.avatar(user.id, user.avatar)
  }

  if (user.discriminator !== "0") {
    return Discord.cdn.defaultAvatar(parseInt(user.discriminator, 10) % 5)
  }

  return Discord.cdn.defaultAvatar(Number((BigInt(user.id) >> 22n) % 6n))
}
