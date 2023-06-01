import { PropsWithChildren } from "react"

export const Container = ({ children }: PropsWithChildren) => (
  <main
    className={
      "flex flex-col items-center w-fit rounded-2xl gap-8 justify-center text-center"
    }
  >
    <h1 className={"text-4xl min-[340px]:text-5xl min-[400px]:text-6xl"}>
      Suspiciously Wealthy Furries
    </h1>
    {children}
  </main>
)
