import { APIGuildMember, APIUser } from "discord-api-types/v10"
import { Variables } from "@/utils/variables"
import { REST } from "@discordjs/rest"

export type MemberWithUser = APIGuildMember & { user: APIUser }
export type MembersResponse = MemberWithUser[]

const globalForDiscord = global as unknown as { discord: REST | undefined }
export const Discord =
  globalForDiscord.discord ??
  new REST({ version: "10" }).setToken(Variables.discordBotToken)

if (process.env.NODE_ENV !== "production") {
  globalForDiscord.discord = Discord
}

export function displayAvatarUrl(user: APIUser, forceStatic: boolean = true) {
  if (user.avatar) {
    return Discord.cdn.avatar(user.id, user.avatar, { forceStatic })
  }

  if (user.discriminator !== "0") {
    return Discord.cdn.defaultAvatar(parseInt(user.discriminator, 10) % 5)
  }

  return Discord.cdn.defaultAvatar(Number((BigInt(user.id) >> 22n) % 6n))
}
