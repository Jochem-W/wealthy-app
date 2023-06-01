import Image from "next/image"
import { SignOutButton } from "@/components/SignOutButton"
import { Session } from "next-auth"
import { JetBrains_Mono } from "next/font/google"

const mono = JetBrains_Mono({ subsets: ["latin"] })

export function SessionInfo({ session }: { session: Session }) {
  return (
    <div className={"flex flex-col items-center p-2 rounded-2xl w-full"}>
      <div className="rounded-full">
        <Image
          src={session.user.image}
          alt={"Discord Avatar"}
          width={64}
          height={64}
        />
      </div>
      <h2 className={"text-2xl"}>
        Signed in as{" "}
        <span className={mono.className}>
          {session.user.name}#{session.user.discriminator}
        </span>
      </h2>
      <span className={"text-sm"}>
        Not you? <SignOutButton></SignOutButton>
      </span>
    </div>
  )
}
