import Image from "next/image"
import { SignOutButton } from "@/components/SignOutButton"
import { Session } from "next-auth"
import { JetBrains_Mono } from "next/font/google"

const mono = JetBrains_Mono({ subsets: ["latin"] })

export const SessionInfo = ({ session }: { session: Session }) => (
  <div className={"flex flex-col items-center rounded-2xl w-full gap-2"}>
    <Image
      className={"rounded-full"}
      src={session.user.image}
      alt={"Discord Avatar"}
      width={64}
      height={64}
    />
    <div className={"flex flex-col"}>
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
  </div>
)
