import { Drizzle } from "@/utils/clients"
import { Discord, MemberWithUser } from "@/utils/discord"
import { RESTGetAPIGuildRolesResult, Routes } from "discord-api-types/v10"
import { Variables } from "@/utils/variables"
import { getSubject } from "@/utils/token"
import { expiredMillis } from "@/utils/misc"
import { inviteesTable, usersTable } from "@/schema"
import { eq } from "drizzle-orm"
import { MemberList } from "@/components/MemberList"

type MembersResponse = MemberWithUser[]

async function getAdminRoles() {
  const roles = (await Discord.get(
    Routes.guildRoles(Variables.guildId),
  )) as RESTGetAPIGuildRolesResult
  return roles.filter(
    (role) => BigInt(role.permissions) & (BigInt(1) << BigInt(3)),
  )
}

function arrayToMap<T, U>(items: T[], keyFn: (item: T) => U) {
  return new Map(items.map((item) => [keyFn(item), item]))
}

function canAccessDiscord(
  subscriber?: typeof usersTable.$inferSelect,
): subscriber is typeof usersTable.$inferSelect {
  if (!subscriber) {
    return false
  }

  return (
    expiredMillis(subscriber) > 0 &&
    Variables.discordTiers.includes(subscriber.lastPaymentTier)
  )
}

function canInvite(
  subscriber?: typeof usersTable.$inferSelect,
): subscriber is typeof usersTable.$inferSelect {
  if (!canAccessDiscord(subscriber)) {
    return false
  }

  return (
    expiredMillis(subscriber) > 0 &&
    Variables.inviteTiers.includes(subscriber.lastPaymentTier)
  )
}

function hasDiscordAccess(member: MemberWithUser) {
  return !member.roles.includes(Variables.unsubcribedRole)
}

type AugmentedMember = {
  member: MemberWithUser
  access: boolean
  expectedAccess: boolean
  subscriber?: typeof usersTable.$inferSelect
}

async function getMembers() {
  const subscribers = arrayToMap(
    await Drizzle.select().from(usersTable),
    (user) => user.discordId,
  )
  const invitees = arrayToMap(
    await Drizzle.select()
      .from(inviteesTable)
      .innerJoin(usersTable, eq(inviteesTable.userId, usersTable.id)),
    ({ invitee }) => invitee.discordId,
  )
  const members = arrayToMap(
    (await Discord.get(Routes.guildMembers(Variables.guildId), {
      query: new URLSearchParams({ limit: "1000" }),
    })) as MembersResponse,
    (member) => member.user.id,
  )

  const data = {
    invalid: [] as AugmentedMember[],
    admin: [] as AugmentedMember[],
    invited: [] as AugmentedMember[],
    subscribed: new Map<string, AugmentedMember[]>(),
  }

  const adminRoles = await getAdminRoles()

  for (const member of members.values()) {
    if (member.user.bot) {
      continue
    }

    if (adminRoles.some((role) => member.roles.includes(role.id))) {
      data.admin.push({
        member,
        access: hasDiscordAccess(member),
        expectedAccess: true,
      })
      continue
    }

    const subscriber = subscribers.get(member.user.id)
    if (canAccessDiscord(subscriber)) {
      {
        let array = data.subscribed.get(subscriber.lastPaymentTier)
        if (!array) {
          array = []
          data.subscribed.set(subscriber.lastPaymentTier, array)
        }

        array.push({
          member,
          access: hasDiscordAccess(member),
          subscriber,
          expectedAccess: true,
        })
        continue
      }
    }

    const invitee = invitees.get(member.user.id)
    if (invitee) {
      data.invited.push({
        member,
        access: hasDiscordAccess(member),
        expectedAccess: canInvite(invitee?.user),
      })
      continue
    }

    data.invalid.push({
      member,
      access: hasDiscordAccess(member),
      expectedAccess: false,
    })
  }

  return data
}

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const subject = await getSubject(searchParams["token"])
  if (!subject || subject !== "1106267397985423440") {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-6xl">Discord Members</h1>
        <p>Invalid token</p>
      </div>
    )
  }

  const members = await getMembers()

  return (
    <>
      <header className="mt-2">
        <h1 className="text-5xl">Discord Members</h1>
      </header>
      <main className="container flex flex-col gap-8">
        <MemberList data={members.invalid} title="No access"></MemberList>
        <MemberList data={members.admin} title="Admin"></MemberList>
        <MemberList data={members.invited} title="Invited"></MemberList>
        {[...members.subscribed.entries()].map(([title, data]) => (
          <MemberList data={data} title={title} key={title}></MemberList>
        ))}
      </main>
    </>
  )
}
