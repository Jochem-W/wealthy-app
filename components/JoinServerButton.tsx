"use client"

import { useCallback, useState } from "react"
import { useSearchParams } from "next/navigation"

export function JoinServerButton() {
  const params = useSearchParams()
  const [disabled, setDisabled] = useState<boolean>(false)
  const [text, setText] = useState("Join server")

  const onClick = useCallback(async () => {
    setDisabled(true)
    setText("Joining server...")
    const response = await fetch(`/api/join?token=${params.get("token") ?? ""}`)
    setText(await response.text())
    if (response.ok) {
      return
    }

    setDisabled(false)
  }, [setText, setDisabled, params])

  return (
    <button
      className={`p-4 text-2xl rounded-2xl transition-colors transition-opacity border border-black bg-neutral-100  dark:bg-neutral-900  dark:border-white ${
        disabled
          ? "opacity-25"
          : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
      }`}
      disabled={disabled}
      onClick={void onClick}
      type={"button"}
    >
      {text}
    </button>
  )
}
