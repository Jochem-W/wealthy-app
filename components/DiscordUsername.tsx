import { RawDiscordUsername } from "./RawDiscordUsername"
import { APIUser } from "discord-api-types/v10"

export const DiscordUsername = ({
  user: { username, discriminator },
}: {
  readonly user: APIUser
}) => (
  <RawDiscordUsername
    username={username}
    discriminator={discriminator}
  ></RawDiscordUsername>
)
