import Link from "next/link"
import { JetBrains_Mono } from "next/font/google"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const EmailLink = ({ email }: { email: string }) => {
  const [username, domain] = email.split("@")
  if (!username || !domain) {
    throw new Error("Invalid email")
  }

  return (
    <Link href={`mailto:${email}`}>
      <span
        className={`${mono.className} underline hover:text-blue-500 transition-colors`}
      >
        {username}
        <wbr />@{domain}
      </span>
    </Link>
  )
}
