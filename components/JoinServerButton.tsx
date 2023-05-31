"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

export const JoinServerButton = () => {
  const params = useSearchParams()
  const [disabled, setDisabled] = useState<boolean>(false)
  const [text, setText] = useState("Join server")

  return (
    <button
      onClick={async () => {
        setDisabled(true)
        setText("Joining server...")
        const response = await fetch(`/api/join?token=${params.get("token")}`)
        if (response.ok) {
          setText("Server joined!")
          return
        }

        setDisabled(false)
        setText(response.statusText)
      }}
      className={`p-4 text-2xl rounded-2xl transition-colors transition-opacity border border-black bg-neutral-100  dark:bg-neutral-900  dark:border-white ${
        disabled
          ? "opacity-25"
          : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
      }`}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
