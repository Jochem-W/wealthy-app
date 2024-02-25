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
    <html lang="en">
      <body>
        <section
          className={`${inter.className} flex min-h-[100svh] w-[100%] flex-col items-center gap-4`}
        >
          {children}
          <footer className="mt-auto">
            <span>&copy; lucasfloof 2023-2024</span>
          </footer>
        </section>
      </body>
    </html>
  )
}
