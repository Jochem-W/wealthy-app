import { APIGuildMember, APIUser, Routes } from "discord-api-types/v10"
import { Variables } from "@/utils/variables"
import { REST } from "@discordjs/rest"
import "server-only"

export type MemberWithUser = APIGuildMember & { user: APIUser }
export type MembersResponse = MemberWithUser[]

const globalForDiscord = global as unknown as { discord: REST | undefined }
export const Discord =
  globalForDiscord.discord ??
  new REST({ version: "10" }).setToken(Variables.discordBotToken)

if (process.env.NODE_ENV !== "production") {
  globalForDiscord.discord = Discord
}

export async function getMembers() {
  const members = (await Discord.get(Routes.guildMembers(Variables.guildId), {
    query: new URLSearchParams({ limit: "1000" }),
  })) as MembersResponse
  return members.filter(
    (member) =>
      !member.user.bot &&
      member.roles.some((role) => Variables.roles.has(role)),
  )
}
