import { Prisma } from "@/utils/clients"
import { Discord, discordTag } from "@/utils/discord"
import { APIGuildMember, APIUser, Routes } from "discord-api-types/v10"
import { Variables } from "@/utils/variables"
import type { User } from "@prisma/client"
import { DateTime } from "luxon"
import { getInviter } from "@/utils/token"
import { MemberComponent } from "@/components/MemberComponent"

type MemberWithUser = APIGuildMember & { user: APIUser }
type MembersResponse = MemberWithUser[]
type TierEntry = { member: MemberWithUser; user?: User }

async function getMembers() {
  const apiMembers = (await Discord.get(
    Routes.guildMembers(Variables.guildId),
    {
      query: new URLSearchParams({ limit: "1000" }),
    }
  )) as MembersResponse

  const members = new Map<string, MemberWithUser>()
  for (const member of apiMembers) {
    members.set(member.user.id, member)
  }

  return members
}

async function getSubscribers() {
  const users = await Prisma.user.findMany()
  const members = await getMembers()
  const tiers = new Map<string, TierEntry[]>()
  const unknownTier = "Unknown"

  for (const member of members.values()) {
    const user = users.find((u) => u.discordId === member.user.id)
    if (!user) {
      if (!tiers.get(unknownTier)) {
        tiers.set(unknownTier, [])
      }

      tiers.get(unknownTier)?.push({ member })
      continue
    }

    if (!tiers.get(user.lastPaymentTier)) {
      tiers.set(user.lastPaymentTier, [])
    }

    tiers.get(user.lastPaymentTier)?.push({ member, user })
  }

  for (const value of tiers.values()) {
    value.sort((a, b) => {
      if (a.user && b.user) {
        return DateTime.fromJSDate(a.user.lastPaymentTime)
          .diff(DateTime.fromJSDate(b.user.lastPaymentTime))
          .toMillis()
      }

      return discordTag(a.member).localeCompare(discordTag(b.member))
    })
  }

  return tiers
}

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const invitee = await getInviter(searchParams["token"])
  if (!invitee || invitee !== "1106267397985423440") {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-6xl">Discord Members</h1>
        <p>Invalid token</p>
      </div>
    )
  }

  const subscribers = await getSubscribers()

  return (
    <div className={"flex flex-col gap-8"}>
      <h1 className="text-5xl">Discord Members</h1>
      {[...subscribers.entries()].map(([key, values]) => (
        <div key={key} className={"flex flex-col gap-2"}>
          <h2 className={"text-3xl"}>{key}</h2>
          {values.map(({ member, user }) => (
            <>
              <div
                key={member.user.id}
                className={"h-0.5 bg-white bg-opacity-10"}
              ></div>
              <MemberComponent member={member} user={user}></MemberComponent>
            </>
          ))}
        </div>
      ))}
    </div>
  )
}
