"use client"

import { signIn } from "next-auth/react"

export const SignInButton = () => {
  return (
    <button
      className={
        "p-4 text-2xl rounded-2xl transition-colors border border-black bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-white"
      }
      onClick={() => signIn("discord")}
    >
      Sign in using Discord
    </button>
  )
}
