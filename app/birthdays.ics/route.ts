import { birthdaysTable } from "@/schema"
import { Drizzle } from "@/utils/clients"
import { Discord } from "@/utils/discord"
import { Variables } from "@/utils/variables"
import { RESTGetAPIGuildMembersResult, Routes } from "discord-api-types/v10"
import { createEvents } from "ics"
import { NextResponse } from "next/server"

export const revalidate = 3600

export async function GET() {
  const names = new Map<string, string>()

  const members = (await Discord.get(Routes.guildMembers(Variables.guildId), {
    query: new URLSearchParams({ limit: "1000" }),
  })) as RESTGetAPIGuildMembersResult
  for (const member of members) {
    if (!member.user) {
      continue
    }

    names.set(member.user.id, member.user.global_name ?? member.user.username)
  }

  const dates = await Drizzle.select().from(birthdaysTable)

  const { error, value } = createEvents(
    dates.map(({ id, month, day }) => ({
      title: `${names.get(id) ?? id}'s Birthday`,
      start: [2023, month, day],
      end: [2023, month, day],
      recurrenceRule: `FREQ=YEARLY;INTERVAL=1;BYMONTH=${month};BYMONTHDAY=${day}`,
      uid: id,
    })),
  )

  if (error || !value) {
    return new NextResponse("Internal error", { status: 500 })
  }

  return new NextResponse(value)
}
