import Image from "next/image"
import { SignOutButton } from "@/components/SignOutButton"
import { Session } from "next-auth"
import { RawDiscordUsername } from "./RawDiscordUsername"

export const SessionInfo = ({ session }: { readonly session: Session }) => (
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
        <RawDiscordUsername
          username={session.user.name}
          discriminator={session.user.discriminator}
        ></RawDiscordUsername>
      </h2>
      <span className={"text-sm"}>
        Not you? <SignOutButton></SignOutButton>
      </span>
    </div>
  </div>
)
