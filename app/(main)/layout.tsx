import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import Link from "next/link"
import { Variables } from "@/utils/variables"

const inter = Inter({ subsets: ["latin"], weight: "variable" })

export function generateMetadata() {
  const metadata: Metadata = {
    title: "Suspiciously Wealthy Furries",
  }

  if (Variables.nextHostname) {
    metadata.metadataBase = Variables.nextHostname
  }

  return metadata
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
        <footer
          className={
            "flex flex-col min-[440px]:flex-row gap-2 items-center text-center"
          }
        >
          <Link
            href={"/privacy"}
            className={
              "underline hover:text-blue-500 transition-colors break-words"
            }
          >
            Privacy Policy
          </Link>
          <span className={"hidden min-[440px]:inline"}>•</span>
          <span>Made by Lucas</span>
        </footer>
      </body>
    </html>
  )
}
