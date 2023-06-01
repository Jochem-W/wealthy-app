"use client"

import { useCallback, useState } from "react"
import { useSearchParams } from "next/navigation"

function getColour(success: boolean | null) {
  if (success === null) {
    return "border-black dark:border-white bg-neutral-500/20 enabled:hover:bg-neutral-500/30"
  }

  if (success) {
    return "border-green-500 bg-green-500/20 enabled:hover:bg-green-500/30"
  }

  return "border-red-500 bg-red-500/20 enabled:hover:bg-red-500/30"
}

export const JoinServerButton = ({ joined }: { joined: boolean }) => {
  const params = useSearchParams()
  const [disabled, setDisabled] = useState<boolean>(joined)
  const [text, setText] = useState(joined ? "Server joined!" : "Join server")
  const [success, setSuccess] = useState<boolean | null>(joined || null)

  const onClick = useCallback(() => {
    const token = params.get("token")
    if (!token) {
      setSuccess(false)
      setDisabled(true)
      setText("Invalid token")
      return
    }

    setSuccess(null)
    setDisabled(true)
    setText("Joining server...")

    void fetch(`/api/join?token=${params.get("token") ?? ""}`)
      .then((response) => {
        setSuccess(response.ok)
        setDisabled(response.ok)
        return response.text()
      })
      .then(setText)
  }, [setText, setDisabled, setSuccess, params])

  return (
    <button
      className={`p-4 text-2xl rounded-2xl transition border disabled:opacity-30 ${getColour(
        success
      )}`}
      disabled={disabled}
      onClick={onClick}
      type={"button"}
    >
      {text}
    </button>
  )
}
