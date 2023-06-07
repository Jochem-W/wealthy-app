import { MemberWithUser, avatarUrl, discordTag } from "@/utils/discord"
import { expiredMillis } from "@/utils/misc"
import type { User } from "@prisma/client"
import { DateTime } from "luxon"
import { JetBrains_Mono } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

export type TierEntry = { member: MemberWithUser; user?: User }

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const MemberComponent = ({
  member,
  user,
}: {
  member: MemberWithUser
  user?: User
}) => {
  let bg = ""
  if (user && expiredMillis(user) < 0) {
    bg = "bg-red-500 bg-opacity-25"
  }

  return (
    <div className={`flex flex-col gap-2 p-2 ${bg}`}>
      <div className={"flex gap-4 items-center"}>
        <Image
          className={"rounded-full"}
          src={avatarUrl(member)}
          alt={"Discord avatar"}
          height={48}
          width={48}
        ></Image>
        <span className={mono.className}>{discordTag(member)}</span>
      </div>
      {user ? (
        <div className={"flex flex-col justify-between"}>
          <Link
            href={`mailto:${user.email}`}
            className={`${mono.className} underline hover:text-blue-500 transition-colors break-all`}
          >
            {user.email}
          </Link>
          <div className="group relative">
            <span className="absolute left-0 visible opacity-100 group-hover:invisible group-hover:opacity-0 transition-all">
              Last paid{" "}
              {DateTime.fromJSDate(user.lastPaymentTime).toRelative({
                unit: ["days", "hours", "minutes", "seconds"],
              })}
            </span>
            <span className="w-max invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all">
              {DateTime.fromJSDate(user.lastPaymentTime).toRFC2822()}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
MemberComponent.defaultProps = { user: undefined }
