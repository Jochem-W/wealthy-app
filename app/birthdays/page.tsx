import { birthdaysTable } from "@/schema"
import { Drizzle } from "@/utils/clients"
import { Discord, displayAvatarUrl } from "@/utils/discord"
import { Variables } from "@/utils/variables"
import {
  APIUser,
  Routes,
  RESTGetAPIGuildMembersResult,
  RESTGetAPIGuildResult,
} from "discord-api-types/v10"
import { DateTime } from "luxon"
import { Metadata } from "next"
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

function displayName(user: APIUser) {
  return user.global_name ?? user.username
}

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const guild = (await Discord.get(
    Routes.guild(Variables.guildId),
  )) as RESTGetAPIGuildResult

  return { title: `${guild.name} | Birthday Calendar ${DateTime.now().year}` }
}

export default async function Page() {
  const guild = (await Discord.get(
    Routes.guild(Variables.guildId),
  )) as RESTGetAPIGuildResult

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

  for (const value of birthdays.values()) {
    value.sort((a, b) => displayName(a).localeCompare(displayName(b)))
  }
  const year = DateTime.now().year

  let date = DateTime.fromObject({ year, month: 1, day: 1 }).startOf("week")

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

  while (date.year !== year + 1) {
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
    if (date.year !== year + 1 && startMonth !== endMonth) {
      months[endMonth - 1]?.push(week)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-3xl">
        {guild.name} Birthday Calendar {year}
      </h1>
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
                      className={`flex w-full flex-col items-center ${date.month !== i + 1 ? "opacity-15" : "before:opacity-15"} gap-1 before:block before:h-px before:w-full before:bg-white`}
                    >
                      <h3 className={date.weekday === 7 ? "text-red-400" : ""}>
                        {date.day}
                      </h3>
                      <section className="flex min-h-16 max-w-full flex-col items-start gap-1 px-1">
                        {birthdays
                          .get(`${date.month}-${date.day}`)
                          ?.map((user) => {
                            return (
                              <section
                                key={`${i}-${user.id}`}
                                title={displayName(user)}
                                className="w-15 flex max-w-full gap-1"
                              >
                                <Image
                                  className="rounded-full"
                                  alt={`${displayName(user)}'s avatar`}
                                  src={displayAvatarUrl(user)}
                                  width={24}
                                  height={24}
                                ></Image>
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                  {displayName(user)}
                                </span>
                              </section>
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
