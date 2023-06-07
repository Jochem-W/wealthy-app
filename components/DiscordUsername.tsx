import { MemberWithUser } from "@/utils/discord"
import { JetBrains_Mono } from "next/font/google"

type Props =
  | { member: MemberWithUser }
  | { username: string; discriminator: string }

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const DiscordUsername = (props: Props) => {
  if ("username" in props) {
    const { username, discriminator } = props
    return discordUsernameSpan(username, discriminator)
  }

  const { member } = props
  return discordUsernameSpan(member.user.username, member.user.discriminator)
}

export function discordUsernameSpan(username: string, discriminator: string) {
  if (discriminator !== "0") {
    return (
      <span className={mono.className}>
        {username}
        <wbr />#{discriminator}
      </span>
    )
  }

  return <span className={mono.className}>{username}</span>
}
