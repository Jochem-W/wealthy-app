import { RawDiscordUsername } from "./RawDiscordUsername"
import { APIUser } from "discord-api-types/v10"

export const DiscordUsername = ({ user: {username} }: { readonly user: APIUser }) => (
  <RawDiscordUsername username={username}></RawDiscordUsername>
)
