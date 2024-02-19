import { PropsWithChildren } from "react"

export const Container = ({ children }: PropsWithChildren) => (
  <main
    className={
      "flex w-fit flex-col items-center justify-center gap-8 rounded-2xl text-center"
    }
  >
    <h1 className={"text-4xl min-[340px]:text-5xl min-[400px]:text-6xl"}>
      Suspiciously Wealthy Furries
    </h1>
    {children}
  </main>
)
