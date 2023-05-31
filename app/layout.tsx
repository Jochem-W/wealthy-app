import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col items-center justify-between min-h-[100dvh]`}
      >
        <header></header>
        {children}
        <footer></footer>
      </body>
    </html>
  )
}
