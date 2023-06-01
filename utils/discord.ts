import { getServerSession, Session } from "next-auth"
import { Options } from "@/app/api/auth/[...nextauth]/route"
import { Routes } from "discord-api-types/v10"
import { Variables } from "@/utils/variables"
import { REST } from "@discordjs/rest"

export const Discord = new REST({ version: "10" }).setToken(
  Variables.discordBotToken
)

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
