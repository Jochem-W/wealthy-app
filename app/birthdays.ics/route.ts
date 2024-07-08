import { birthdaysTable } from "@/schema"
import { Drizzle } from "@/utils/clients"
import { Discord, getMembers } from "@/utils/discord"
import { Variables } from "@/utils/variables"
import { APIUser, RESTGetAPIGuildResult, Routes } from "discord-api-types/v10"
import { EventAttributes, createEvents } from "ics"
import { NextResponse } from "next/server"

export const revalidate = 3600

export async function GET() {
  const guild = (await Discord.get(
    Routes.guild(Variables.guildId),
  )) as RESTGetAPIGuildResult

  const users = new Map<string, APIUser>()

  for (const member of await getMembers()) {
    users.set(member.user.id, member.user)
  }

  const dates = await Drizzle.select().from(birthdaysTable)

  const { error, value } = createEvents(
    dates
      .filter(({ id }) => users.has(id))
      .map(({ id, month, day }) => {
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

        const user = users.get(id) as APIUser
        event.title = `${user.global_name ?? user.username}'s Birthday`
        if (user.global_name) {
          event.description = `Username: ${user.username}`
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
