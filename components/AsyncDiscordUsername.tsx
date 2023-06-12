import { Discord, UpdatedAPIUser } from "@/utils/discord"
import { Routes } from "discord-api-types/v10"
import { DiscordUsername } from "@/components/DiscordUsername"

export const AsyncDiscordUsername = async ({ id }: { id: string }) => {
  const user = (await Discord.get(Routes.user(id))) as UpdatedAPIUser
  return <DiscordUsername user={user}></DiscordUsername>
}
