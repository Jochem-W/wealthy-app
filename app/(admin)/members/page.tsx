import { Prisma } from "@/utils/clients"
import { Discord } from "@/utils/discord"
import {
  APIGuildMember,
  APIUser,
  RESTGetAPIGuildRolesResult,
  Routes,
} from "discord-api-types/v10"
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

async function getAdminRoles() {
  const roles = (await Discord.get(
    Routes.guildRoles(Variables.guildId)
  )) as RESTGetAPIGuildRolesResult
  return roles.filter(
    (role) => BigInt(role.permissions) & (BigInt(1) << BigInt(3))
  )
}

function discordUsername(member: MemberWithUser) {
  if (member.user.discriminator !== "0") {
    return `${member.user.username}#${member.user.discriminator}`
  }

  return member.user.username
}

async function getSubscribers() {
  const users = await Prisma.user.findMany()
  const members = await getMembers()
  const adminRoles = await getAdminRoles()
  const tiers = new Map<string, TierEntry[]>()
  const unknownTier = "Unknown"
  const unsubscribedStaff = "Unsubscribed staff"

  tiers.set(unknownTier, [])
  tiers.set(unsubscribedStaff, [])

  for (const member of members.values()) {
    if (member.user.bot) {
      continue
    }

    const user = users.find((u) => u.discordId === member.user.id)
    if (!user) {
      if (adminRoles.some((role) => member.roles.includes(role.id))) {
        tiers.get(unsubscribedStaff)?.push({ member })
        continue
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

      return discordUsername(a.member).localeCompare(discordUsername(b.member))
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
    <>
      <h1 className="text-5xl">Discord Members</h1>
      {[...subscribers.entries()]
        .filter(([, values]) => values.length > 0)
        .map(([key, values]) => (
          <div className={"flex flex-col gap-2"} key={key}>
            <h2 className={"text-3xl"}>{key}</h2>
            <div
              className={
                "grid grid-cols-[repeat(auto-fill,_minmax(min(350px,_100%),_1fr))] gap-2"
              }
            >
              {values.map(({ member, user }) => (
                <div className="flex flex-col gap-2" key={member.user.id}>
                  <div className={"h-0.5 bg-neutral-500 bg-opacity-30"}></div>
                  <MemberComponent
                    member={member}
                    user={user}
                  ></MemberComponent>
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  )
}
