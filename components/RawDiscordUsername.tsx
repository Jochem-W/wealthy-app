import { JetBrains_Mono } from "next/font/google"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const RawDiscordUsername = ({
  username,
  discriminator = undefined,
}: {
  username: string
  discriminator?: string
}) => {
  const [before, after] = discriminator
    ? [username, discriminator]
    : username.split("#")
  if (!after || after === "0") {
    return <span className={mono.className}>{before}</span>
  }

  return (
    <span className={mono.className}>
      {before}
      <wbr />#{after}
    </span>
  )
}
