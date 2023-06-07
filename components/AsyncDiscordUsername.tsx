import { Discord } from "@/utils/discord"
import { RESTGetAPIUserResult, Routes } from "discord-api-types/v10"
import { discordUsernameSpan } from "@/components/DiscordUsername"

export const AsyncDiscordUsername = async ({ id }: { id: string }) => {
  const response = (await Discord.get(Routes.user(id))) as RESTGetAPIUserResult

  return discordUsernameSpan(response.username, response.discriminator)
}
