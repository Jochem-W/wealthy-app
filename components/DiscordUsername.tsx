import { userDisplayName } from "@/utils/discord"
import { RawDiscordUsername } from "./RawDiscordUsername"
import { APIUser } from "discord-api-types/v10"

export const DiscordUsername = ({ user }: { readonly user: APIUser }) => (
  <RawDiscordUsername username={userDisplayName(user)}></RawDiscordUsername>
)
