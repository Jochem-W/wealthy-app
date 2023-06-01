import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Suspiciously Wealthy Furries",
}

// eslint-disable-next-line react/function-component-definition
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col items-center justify-between min-h-[100svh] p-4 gap-4`}
      >
        <header></header>
        {children}
        <footer className={"flex gap-2"}>
          <Link
            href={"/privacy"}
            className={"underline hover:text-blue-500 transition-colors"}
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            href={"/tos"}
            className={"underline hover:text-blue-500 transition-colors"}
          >
            Terms of Service
          </Link>
        </footer>
      </body>
    </html>
  )
}
