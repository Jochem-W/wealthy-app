"use client"

import { useCallback, useState } from "react"
import { useSearchParams } from "next/navigation"

export const JoinServerButton = ({ joined }: { joined: boolean }) => {
  const params = useSearchParams()
  const [disabled, setDisabled] = useState<boolean>(joined)
  const [text, setText] = useState(joined ? "Server joined!" : "Join server")

  const onClick = useCallback(() => {
    void (async () => {
      setDisabled(true)
      setText("Joining server...")
      const response = await fetch(
        `/api/join?token=${params.get("token") ?? ""}`
      )
      setText(await response.text())
      if (response.ok) {
        return
      }

      setDisabled(false)
    })()
  }, [setText, setDisabled, params])

  return (
    <button
      className={`p-4 text-2xl rounded-2xl transition-colors transition-opacity border border-black bg-neutral-100  dark:bg-neutral-900  dark:border-white ${
        disabled
          ? "opacity-25"
          : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
      }`}
      disabled={disabled}
      onClick={onClick}
      type={"button"}
    >
      {text}
    </button>
  )
}
