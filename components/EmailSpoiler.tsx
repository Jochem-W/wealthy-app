"use client"

import { EmailLink } from "@/components/EmailLink"
import { useCallback, useState } from "react"
import { JetBrains_Mono } from "next/font/google"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const EmailSpoiler = ({ email }: { email: string }) => {
  const [hidden, setHidden] = useState(true)

  return (
    <button
      className={`flex ${mono.className}`}
      type={"button"}
      onClick={useCallback(() => setHidden(false), [setHidden])}
    >
      {hidden ? (
        <span
          className={
            "whitespace-pre transition-colors bg-neutral-500 bg-opacity-25 hover:bg-opacity-50"
          }
        >
          {" ".repeat(email.length)}
        </span>
      ) : (
        <EmailLink email={email}></EmailLink>
      )}
    </button>
  )
}
