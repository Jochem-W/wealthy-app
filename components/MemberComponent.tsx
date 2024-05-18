import { MemberWithUser } from "@/utils/discord"
import { DateTime } from "luxon"
import Image from "next/image"
import { DiscordUsername } from "@/components/DiscordUsername"
import { EmailSpoiler } from "@/components/EmailSpoiler"
import { JetBrains_Mono } from "next/font/google"
import { usersTable } from "@/schema"
import { displayAvatarUrl } from "@/utils/discordClient"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const MemberComponent = ({
  member,
  access,
  expectedAccess,
  user,
}: {
  member: MemberWithUser
  access: boolean
  expectedAccess: boolean
  user?: typeof usersTable.$inferSelect
}) => {
  let bg = ""
  if (access !== expectedAccess) {
    bg = "bg-red-500 bg-opacity-25"
  }

  return (
    <div className={`flex flex-col gap-2 p-2 ${bg}`}>
      <div className={"flex items-center gap-4"}>
        <Image
          className={"rounded-full"}
          src={displayAvatarUrl(member.user)}
          alt={"Discord avatar"}
          height={48}
          width={48}
        ></Image>
        <div className={`flex flex-col ${mono.className}`}>
          {member.user.global_name ? (
            <span>{member.user.global_name}</span>
          ) : undefined}
          <DiscordUsername user={member.user}></DiscordUsername>
          <span>{member.user.id}</span>
        </div>
      </div>
      {user ? (
        <div className={"flex flex-col justify-between"}>
          <span className={mono.className}>{user.name}</span>
          <EmailSpoiler email={user.email}></EmailSpoiler>
          <div className="group relative w-fit">
            <span className="visible absolute left-0 opacity-100 transition-all group-hover:invisible group-hover:opacity-0">
              Last paid{" "}
              {DateTime.fromJSDate(user.lastPaymentTimestamp).toRelative({
                unit: ["days", "hours", "minutes", "seconds"],
              })}
            </span>
            <span className="invisible w-max opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              {DateTime.fromJSDate(user.lastPaymentTimestamp).toRFC2822()}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
