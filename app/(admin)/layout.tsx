import Link from "next/link"
import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], weight: "variable" })

// eslint-disable-next-line react/function-component-definition
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} flex flex-col items-center justify-between min-h-[100svh] p-4 gap-4`}
    >
      <body className={"flex flex-col gap-4"}>
        <header>
          {/*<h1 className={"text-6xl text-center"}>*/}
          {/*  Suspiciously Wealthy Furries*/}
          {/*</h1>*/}
        </header>
        <main className={"flex flex-col container"}>{children}</main>
        <footer
          className={
            "flex flex-col min-[440px]:flex-row gap-2 items-center text-center justify-center"
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
