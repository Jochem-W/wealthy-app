import { PropsWithChildren } from "react"

export function Container({ children }: PropsWithChildren) {
  return (
    <main
      className={
        "flex flex-col items-center w-fit rounded-2xl p-4 gap-8 justify-center text-center"
      }
    >
      <h1 className={"text-4xl min-[340px]:text-5xl min-[400px]:text-6xl"}>
        Suspiciously Wealthy Furries
      </h1>
      {children}
    </main>
  )
}
