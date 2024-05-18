import { MemberWithUser } from "@/utils/discord"
import { MemberComponent } from "./MemberComponent"
import { usersTable } from "@/schema"

export function MemberList({
  data,
  title,
}: {
  data: {
    member: MemberWithUser
    access: boolean
    expectedAccess: boolean
    subscriber?: typeof usersTable.$inferSelect
  }[]
  title: string
}) {
  return (
    <div className={"flex flex-col gap-2"}>
      <h2 className={"text-3xl"}>{title}</h2>
      <div
        className={
          "grid grid-cols-[repeat(auto-fill,_minmax(min(350px,_100%),_1fr))] gap-2"
        }
      >
        {data.map((value) => (
          <div className="flex flex-col gap-2" key={value.member.user.id}>
            <div className={"h-0.5 bg-neutral-500 bg-opacity-30"}></div>
            {value.subscriber ? (
              <MemberComponent
                member={value.member}
                user={value.subscriber}
                access={value.access}
                expectedAccess={value.expectedAccess}
              ></MemberComponent>
            ) : (
              <MemberComponent
                member={value.member}
                access={value.access}
                expectedAccess={value.expectedAccess}
              ></MemberComponent>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
