"use client"

import { EmailLink } from "@/components/EmailLink"
import { useCallback, useState } from "react"
import { JetBrains_Mono } from "next/font/google"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const EmailSpoiler = ({ email }: { readonly email: string }) => {
  const [hidden, setHidden] = useState(true)

  return (
    <button
      className={`flex ${mono.className} w-fit`}
      type={"button"}
      onClick={useCallback(() => setHidden(false), [setHidden])}
    >
      {hidden ? (
        <span
          className={
            "whitespace-pre bg-neutral-500 bg-opacity-25 transition-colors hover:bg-opacity-50"
          }
        >
          {" ".repeat(email.length)}
        </span>
      ) : (
        <EmailLink
          email={email}
          className={"bg-neutral-500 bg-opacity-10"}
        ></EmailLink>
      )}
    </button>
  )
}
