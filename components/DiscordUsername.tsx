import { UpdatedAPIUser, userDisplayName } from "@/utils/discord"
import { RawDiscordUsername } from "./RawDiscordUsername"

export const DiscordUsername = ({ user }: { user: UpdatedAPIUser }) => (
  <RawDiscordUsername username={userDisplayName(user)}></RawDiscordUsername>
)
