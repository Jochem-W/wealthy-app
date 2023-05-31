"use client"

import { signOut } from "next-auth/react"

export const SignOutButton = () => {
  return (
    <button
      className={"underline hover:text-blue-600 transition-colors"}
      onClick={() => signOut()}
    >
      Sign out
    </button>
  )
}
