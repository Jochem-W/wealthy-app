import Calendar from "@/components/Calendar"
import { birthdaysTable } from "@/schema"
import { Drizzle } from "@/utils/clients"
import { Discord, getMembers } from "@/utils/discord"
import { displayName } from "@/utils/discordClient"
import { Variables } from "@/utils/variables"
import { APIUser, Routes, RESTGetAPIGuildResult } from "discord-api-types/v10"
import { DateTime } from "luxon"
import { Metadata } from "next"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const guild = (await Discord.get(
    Routes.guild(Variables.guildId),
  )) as RESTGetAPIGuildResult

  return { title: `${guild.name} | Birthday Calendar` }
}

async function getBirthdays() {
  const users = new Map<string, APIUser>()

  const members = await getMembers()
  for (const { member, expectedAccess } of [
    ...members.invalid,
    ...members.admin,
    ...members.invited,
    ...[...members.subscribed.values()].flat(),
  ]) {
    if (expectedAccess) {
      users.set(member.user.id, member.user)
    }
  }

  const data = await Drizzle.select().from(birthdaysTable)
  const birthdays = new Map<string, APIUser[]>()

  for (const entry of data) {
    const user = users.get(entry.id)
    if (!user) {
      continue
    }

    const key = `${entry.month}-${entry.day}`
    if (!birthdays.has(key)) {
      birthdays.set(key, [user])
      continue
    }

    birthdays.get(key)?.push(user)
  }

  for (const value of birthdays.values()) {
    value.sort((a, b) => displayName(a).localeCompare(displayName(b)))
  }

  return birthdays
}

export default async function Page() {
  const guild = (await Discord.get(
    Routes.guild(Variables.guildId),
  )) as RESTGetAPIGuildResult

  const birthdays = await getBirthdays()
  const now = DateTime.now().toMillis()

  return (
    <Calendar birthdays={birthdays} initialToday={now} guild={guild}></Calendar>
  )
}
