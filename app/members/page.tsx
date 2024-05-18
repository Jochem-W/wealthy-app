import { getSubject } from "@/utils/token"
import { MemberList } from "@/components/MemberList"
import { getMembers } from "@/utils/discord"

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const subject = await getSubject(searchParams["token"])
  if (!subject || subject !== "1106267397985423440") {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-6xl">Discord Members</h1>
        <p>Invalid token</p>
      </div>
    )
  }

  const members = await getMembers()

  return (
    <>
      <header className="mt-2">
        <h1 className="text-5xl">Discord Members</h1>
      </header>
      <main className="container flex flex-col gap-8">
        <MemberList data={members.invalid} title="No access"></MemberList>
        <MemberList data={members.admin} title="Admin"></MemberList>
        <MemberList data={members.invited} title="Invited"></MemberList>
        {[...members.subscribed.entries()].map(([title, data]) => (
          <MemberList data={data} title={title} key={title}></MemberList>
        ))}
      </main>
    </>
  )
}
