import { birthdaysTable } from "@/schema"
import { Drizzle } from "@/utils/clients"
import { Discord } from "@/utils/discord"
import { Variables } from "@/utils/variables"
import {
  APIUser,
  RESTGetAPIGuildMembersResult,
  RESTGetAPIGuildResult,
  Routes,
} from "discord-api-types/v10"
import { EventAttributes, createEvents } from "ics"
import { NextResponse } from "next/server"

export const revalidate = 3600

export async function GET() {
  const users = new Map<string, APIUser>()

  const guild = (await Discord.get(
    Routes.guild(Variables.guildId),
  )) as RESTGetAPIGuildResult

  const members = (await Discord.get(Routes.guildMembers(Variables.guildId), {
    query: new URLSearchParams({ limit: "1000" }),
  })) as RESTGetAPIGuildMembersResult
  for (const member of members) {
    if (!member.user) {
      continue
    }

    users.set(member.user.id, member.user)
  }

  const dates = await Drizzle.select().from(birthdaysTable)

  const { error, value } = createEvents(
    dates.map(({ id, month, day }) => {
      const event: EventAttributes = {
        title: `${id}'s Birthday`,
        start: [2023, month, day],
        end: [2023, month, day],
        recurrenceRule: `FREQ=YEARLY;INTERVAL=1;BYMONTH=${month};BYMONTHDAY=${day}`,
        uid: id,
        description: `User ID: ${id}`,
        status: "CONFIRMED",
        busyStatus: "FREE",
        transp: "TRANSPARENT",
        startInputType: "utc",
        startOutputType: "utc",
        endInputType: "utc",
        endOutputType: "utc",
        url: new URL(id, "https://discord.com/users/").toString(),
      }

      const user = users.get(id)
      if (user) {
        event.title = `${user.global_name ?? user.username}'s Birthday`
        if (user.global_name) {
          event.description = `Username: ${user.username}`
        }
      }

      return event
    }),
    { calName: `${guild.name} Birthdays` },
  )

  if (error || !value) {
    return new NextResponse("Internal error", { status: 500 })
  }

  return new NextResponse(value, {
    headers: { "Content-Type": "text/calendar" },
  })
}
