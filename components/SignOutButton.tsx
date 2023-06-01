"use client"

import { signOut } from "next-auth/react"

function onClick() {
  void signOut()
}

export function SignOutButton() {
  return (
    <button
      className={"underline hover:text-blue-600 transition-colors"}
      onClick={onClick}
      type={"button"}
    >
      Sign out
    </button>
  )
}
