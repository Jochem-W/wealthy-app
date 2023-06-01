import { JetBrains_Mono } from "next/font/google"
import Link from "next/link"

const mono = JetBrains_Mono({ subsets: ["latin"] })

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  return (
    <div className={"flex flex-col gap-4"}>
      <header className={"flex flex-col items-center gap-2 text-center"}>
        <h1 className={"text-4xl min-[340px]:text-5xl min-[400px]:text-6xl"}>
          Privacy Policy
        </h1>
        <span className={"opacity-50 text-sm"}>
          TL;DR: there&apos;s nothing you have to worry about.
        </span>
      </header>
      <main className={"max-w-[75ch] flex flex-col gap-4"}>
        <div className={"flex flex-col gap-1"}>
          <p>
            I only purposefully store information that I need to provide my
            services. This may include, but isn&apos;t limited to:
          </p>
          <ul className={"list-disc ml-5"}>
            <li>Publicly accessible Discord account information</li>
            <li>Non-sensitive Ko-fi account details (e.g. email address)</li>
          </ul>
          <p>
            If at any time you&apos;d like to see exactly which data I have
            stored, or have any other requests related to your data, please send
            me a direct message on Discord.
          </p>
        </div>
        <div className={"flex flex-col gap-1"}>
          <p>
            I selected only the Discord OAuth scopes that I need to provide this
            service:
          </p>
          <ul className={"list-disc ml-5"}>
            <li>
              <span className={mono.className}>identify</span>: access to basic
              account information that&apos;s already publicly accessible.
            </li>
            <li>
              <span className={mono.className}>guilds.join</span>: the
              permission to add you to servers.
            </li>
          </ul>
        </div>
        <p>
          This site makes use of cookies and local storage to store information
          about your session. If it bothers you that there wasn&apos;t a cookie
          consent banner, please send me a direct message on Discord.
        </p>
        <p>
          To make troubleshooting easier, my webserver stores various logs.
          These logs can contain parts of the traffic sent to my webserver, and
          are cleared every once in a while. To see exactly what data is sent to
          my webserver, please use the{" "}
          <span className={mono.className}>Network</span> tab in your
          browser&apos;s <span className={mono.className}>Developer Tools</span>
          .
        </p>
        <p>
          I use Cloudflare to protect myself, my services, and the end-user.
          This means that all data sent to my webserver is processed and
          (temporarily) stored by Cloudflare. For more information, please refer
          to{" "}
          <Link
            className={`underline ${mono.className} transition-colors hover:text-blue-500`}
            href={"https://www.cloudflare.com/en-gb/privacypolicy/"}
          >
            Cloudflare&apos;s Privacy Policy
          </Link>
          .
        </p>
        <p>
          If for whatever reason you&apos;d like to take a look at the source
          code, my server setup, my Cloudflare setup, or anything related to
          this service, please send me a direct message on Discord.
        </p>
      </main>
    </div>
  )
}
