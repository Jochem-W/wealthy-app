"use client"

import { displayAvatarUrl, displayName } from "@/utils/discordClient"
import { APIGuild, APIUser } from "discord-api-types/v10"
import { DateTime } from "luxon"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

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

function getMonth(year: number, month: number) {
  const weeks: DateTime[][] = []

  let cursor = DateTime.fromObject({ year, month }).startOf("week")
  let week = []
  while (weeks.length === 0 || cursor.month === month || cursor.weekday !== 1) {
    week.push(cursor)
    if (cursor.weekday === 7) {
      weeks.push(week)
      week = []
    }

    cursor = cursor.plus({ days: 1 })
  }

  return weeks
}

function getYear(year: number) {
  return [...Array(12).keys()].map((m) => getMonth(year, m + 1))
}

export default function Calendar({
  guild,
  birthdays,
  initialToday,
}: {
  guild: APIGuild
  birthdays: Map<string, APIUser[]>
  initialToday: number
}) {
  const [today, setToday] = useState(
    DateTime.fromMillis(initialToday, { zone: "utc" }),
  )
  const [scroll, setScroll] = useState(today.month - 1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayRef = useRef<HTMLDivElement>(null)

  // Set the date/time to the current time on load
  useEffect(() => setToday(DateTime.now()), [])

  // Update index when the wheel is used
  useEffect(() => {
    function listener(evt: WheelEvent) {
      if (evt.shiftKey) {
        return
      }

      setScroll((prev) =>
        Math.max(Math.min(prev + Math.sign(evt.deltaY) * 1, 11), 0),
      )
    }

    window.addEventListener("wheel", listener)
    return () => window.removeEventListener("wheel", listener)
  }, [])

  // Update the date/time automatically
  useEffect(() => {
    const timeout = setTimeout(
      () => setToday(DateTime.now()),
      today.plus({ days: 1 }).startOf("day").diff(today).toMillis(),
    )

    return () => clearTimeout(timeout)
  }, [today])

  // Scroll to the current index when the index changes
  // Debounce?
  useEffect(
    () =>
      scrollRef.current?.children[scroll]?.scrollIntoView({
        block: "end",
        inline: "center",
      }),
    [scroll],
  )

  // Update the index when the day changes
  useEffect(() => setScroll(today.month - 1), [today])

  const months = getYear(today.year)

  return (
    <>
      <header className="mt-2">
        <h1 className="text-center text-3xl">
          {guild.name} Birthday Calendar {today.year}
        </h1>
      </header>
      <main
        ref={scrollRef}
        className="container flex snap-x snap-mandatory gap-20 overflow-x-scroll scroll-smooth"
      >
        {months.map((month, i) => (
          <section
            key={`m${i}`}
            className="flex w-full shrink-0 snap-center snap-always flex-col items-center gap-2"
          >
            <h2 className="text-2xl">{monthNames[i]}</h2>
            <section
              className="grid h-full w-full grid-cols-7 justify-items-center"
              style={{
                gridTemplateRows: `auto repeat(${month.length}, minmax(0, 1fr))`,
              }}
            >
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span className="text-red-400">S</span>
              {month.map((week) =>
                week.map((date) => (
                  <section
                    ref={date.hasSame(today, "day") ? todayRef : undefined}
                    key={`${date.year}-${date.month}-${date.day}`}
                    className={`${date.month !== i + 1 ? "opacity-15" : "before:opacity-15"} ${date.hasSame(today, "day") ? "bg-neutral-100 dark:bg-neutral-900" : ""} flex w-full flex-col items-center gap-1 before:block before:h-px before:w-full before:bg-black dark:before:bg-white`}
                  >
                    <h3
                      className={
                        date.weekday === 7 ? "text-red-400" : undefined
                      }
                    >
                      {date.day}
                    </h3>
                    <section className="flex max-w-full flex-col items-start gap-1 px-1 pb-1 text-xs sm:text-base">
                      {birthdays
                        .get(`${date.month}-${date.day}`)
                        ?.map((user) => (
                          <section
                            key={`${i}-${user.id}`}
                            title={displayName(user)}
                            className="w-15 flex max-w-full items-center gap-1"
                          >
                            <Image
                              className="rounded-full sm:hidden"
                              alt={`${displayName(user)}'s avatar`}
                              src={displayAvatarUrl(user)}
                              width={16}
                              height={16}
                            ></Image>
                            <Image
                              className="hidden rounded-full sm:block"
                              alt={`${displayName(user)}'s avatar`}
                              src={displayAvatarUrl(user)}
                              width={24}
                              height={24}
                            ></Image>
                            <span className="overflow-hidden text-clip whitespace-nowrap sm:text-ellipsis">
                              {displayName(user)}
                            </span>
                          </section>
                        ))}
                    </section>
                  </section>
                )),
              )}
            </section>
          </section>
        ))}
      </main>
    </>
  )
}
