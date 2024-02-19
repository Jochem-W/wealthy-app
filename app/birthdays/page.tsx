import { birthdaysTable } from "@/schema"
import { Drizzle } from "@/utils/clients"
import { Discord, displayAvatarUrl } from "@/utils/discord"
import { Variables } from "@/utils/variables"
import {
  APIUser,
  Routes,
  RESTGetAPIGuildMembersResult,
} from "discord-api-types/v10"
import { DateTime } from "luxon"
import Image from "next/image"

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const revalidate = 3600

export default async function Page() {
  const users = new Map<string, APIUser>()

  const members = (await Discord.get(Routes.guildMembers(Variables.guildId), {
    query: new URLSearchParams({ limit: "1000" }),
  })) as RESTGetAPIGuildMembersResult
  for (const member of members) {
    if (!member.user) {
      continue
    }

    users.set(member.user.id, member.user)
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

  let date = DateTime.fromObject({ year: 2024, month: 1, day: 1 }).startOf(
    "week",
  )

  const months: (DateTime<true> | DateTime<false>)[][][] = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]

  while (date.year !== 2025) {
    const week = []
    do {
      week.push(date)
      date = date.plus({ days: 1 })
    } while (date.weekday !== 1)

    const startMonth = week[0]?.month
    const endMonth = week.at(-1)?.month
    if (!startMonth || !endMonth) {
      break
    }

    months[startMonth - 1]?.push(week)
    if (date.year !== 2025 && startMonth !== endMonth) {
      months[endMonth - 1]?.push(week)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      {months.map((month, i) => {
        return (
          <section key={`m${i}`} className="flex flex-col items-center gap-2">
            <h2 className="text-2xl">{monthNames[i]}</h2>
            <section className="grid w-full max-w-4xl grid-cols-7 justify-items-center gap-y-1">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span className="text-red-400">S</span>
              {month.map((week) => {
                return week.map((date) => {
                  return (
                    <section
                      key={`${date.year}${date.month}${date.day}`}
                      className={`flex w-full flex-col items-center ${date.month !== i + 1 ? "opacity-15" : "before:opacity-15"} ${date.weekday === 7 ? "text-red-400" : ""} gap-1 before:block before:h-px before:w-full before:bg-white`}
                    >
                      <h3>{date.day}</h3>
                      <section className="flex min-h-16 flex-wrap items-start justify-center gap-1">
                        {birthdays
                          .get(`${date.month}-${date.day}`)
                          ?.map((user) => {
                            return (
                              <Image
                                title={user.global_name ?? user.username}
                                className="rounded-full"
                                alt={`${user.global_name ?? user.username}'s avatar`}
                                key={`${i}-${user.id}`}
                                src={displayAvatarUrl(user)}
                                width={24}
                                height={24}
                              ></Image>
                            )
                          })}
                      </section>
                    </section>
                  )
                })
              })}
            </section>
          </section>
        )
      })}
    </section>
  )
}
