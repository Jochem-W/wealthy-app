import Link from "next/link"
import { JetBrains_Mono } from "next/font/google"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

export const EmailLink = ({
  email,
  className,
}: {
  email: string
  className?: string
}) => {
  const [username, domain] = email.split("@")
  if (!username || !domain) {
    throw new Error("Invalid email")
  }

  return (
    <Link href={`mailto:${email}`} className={className}>
      <span
        className={`${mono.className} underline hover:text-blue-500 transition-colors`}
      >
        {username}
        <wbr />@{domain}
      </span>
    </Link>
  )
}

EmailLink.defaultProps = { className: undefined }
