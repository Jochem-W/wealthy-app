import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

// eslint-disable-next-line react/function-component-definition
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col items-center gap-2 justify-between min-h-[100svh] p-4`}
      >
        <div></div>
        {children}
        <footer></footer>
      </body>
    </html>
  )
}
