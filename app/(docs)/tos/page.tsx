// eslint-disable-next-line react/function-component-definition
export default function Page() {
  return (
    <div className={"flex flex-col gap-4"}>
      <header className={"flex flex-col items-center gap-2 text-center"}>
        <h1 className={"text-4xl min-[340px]:text-5xl min-[400px]:text-6xl"}>
          Terms of Service
        </h1>
        <span className={"opacity-50 text-sm"}>
          TL;DR: don&apos;t abuse this website.
        </span>
      </header>
      <main className={"max-w-[75ch] flex flex-col gap-4"}>
        <p>
          By using this service, you agree to not abuse it in any way. What
          exactly constitutes as abuse, will be evaluated on a case-by-case
          basis. If you have to ask yourself whether something is abusive, it
          probably is.
        </p>
        <p>
          If you have any questions about this service, please send me a direct
          message on Discord.
        </p>
      </main>
    </div>
  )
}
