import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], weight: "variable" })

// eslint-disable-next-line react/function-component-definition
export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} flex min-h-[100svh] flex-col items-center justify-between gap-4`}
    >
      <body className={"flex w-[100%] flex-col items-center gap-4"}>
        <header>
          {/*<h1 className={"text-6xl text-center"}>*/}
          {/*  Suspiciously Wealthy Furries*/}
          {/*</h1>*/}
        </header>
        <main className={"container flex flex-col gap-8"}>{children}</main>
        <footer
          className={
            "flex flex-col items-center justify-center gap-2 text-center min-[440px]:flex-row"
          }
        >
          <span>&copy; lucasfloof 2023-2024</span>
        </footer>
      </body>
    </html>
  )
}
