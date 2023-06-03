import { Discord } from "@/utils/discord"
import { RESTGetAPIUserResult, Routes } from "discord-api-types/v10"
import { JetBrains_Mono } from "next/font/google"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const UserSpan = async ({ id }: { id: string }) => {
  const response = (await Discord.get(Routes.user(id))) as RESTGetAPIUserResult

  return (
    <span className={mono.className}>
      {response.username}#{response.discriminator}
    </span>
  )
}
