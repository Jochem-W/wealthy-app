import { JetBrains_Mono } from "next/font/google"
import Link from "next/link"
import { EmailLink } from "@/components/EmailLink"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: "variable" })

// eslint-disable-next-line react/function-component-definition
export default function Page() {
  return (
    <div className={"flex flex-col gap-4"}>
      <header className={"flex flex-col items-center gap-2 text-center"}>
        <h1 className={"text-4xl min-[340px]:text-5xl min-[400px]:text-6xl"}>
          Privacy Policy
        </h1>
        <span className={"opacity-50 text-sm"}>
          TL;DR: your data are only used for the provision of my services.
        </span>
      </header>
      <main className={"max-w-[75ch] flex flex-col gap-4"}>
        <div className={"flex flex-col gap-8"}>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"text-2xl"}>Contact information</h2>
            <p>
              If you&apos;d like to contact me, please use one the following:
            </p>
            <ul className={"list-disc ml-5"}>
              <li>
                Discord: <span className={mono.className}>lucasfloof</span>
              </li>
              <li>
                Twitter:{" "}
                <Link
                  className={`${mono.className} underline transition-colors hover:text-blue-500`}
                  href={"https://twitter.com/lucasfloof"}
                >
                  @lucasfloof
                </Link>
              </li>
              <li>
                Email: <EmailLink email={"admin@lemon-tree.site"}></EmailLink>
              </li>
            </ul>
          </div>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"text-2xl"}>My services</h2>
            <p>
              This privacy policy applies both to the{" "}
              <span className={mono.className}>Wealthy Bot</span> bot in the
              Discord server, as well as the invite service. Henceforth, the
              Discord bot and invite service will be referred to collectively as
              &quot;my services&quot;.
            </p>
            <p>
              The primary goal of my services is to aid Lemon in keeping track
              of Ko-fi members, and ensuring that those who are in the exclusive
              Ko-fi Discord server are paying members. The second goal of my
              services is to provide benefits to certain tiers. One of these
              benefits is the invite service.
            </p>
          </div>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"text-2xl"}>Your rights</h2>
            <p>
              You&apos;re free to exercise any rights you&apos;re legally
              entitled to, such as rights under the General Data Protection
              Regulation (GDPR). This includes, but isn&apos;t limited to:
            </p>
            <ul className={"list-disc ml-5"}>
              <li>Right of access by the data subject.</li>
              <li>Right to erasure.</li>
            </ul>
            <p>Any other requests will be evaluated on a case-by-case basis.</p>
          </div>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"text-2xl"}>Usage of cookies</h2>
            <p>Various cookies are used to allow you to sign in to Discord.</p>
          </div>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"text-2xl"}>Storage of personal data</h2>
            <p>
              To provide my services, I have to store some personal data. These
              data are never sold, or used for any purposes other than the
              provision of my services. These data include:
            </p>
            <ul className={"list-disc ml-5"}>
              <li>
                Your Discord user ID, which is used to link Ko-fi accounts to
                Discord users, and to link invitees to subscribers.
              </li>
            </ul>
            <p>
              In case you&apos;re subscribed to Lemon&apos;s Ko-fi, the
              following personal data are also stored:
            </p>
            <ul className={"list-disc ml-5"}>
              <li>
                Your Ko-fi email address, which is used to connect your Ko-fi
                subscription to Discord for administrative and monitoring
                purposes. The storing of your email address allows us to make
                use of the data listed below.
              </li>
              <li>
                Your current subscription tier, which is used to keep track of
                changes to your subscription.
              </li>
              <li>
                The timestamp of your last subscription payment, which is used
                to keep track of overdue payments and subscription
                cancellations.
              </li>
            </ul>
            <p>
              Ko-fi doesn&apos;t automatically remove members that unsubscribed,
              and also doesn&apos;t do a great job at sending notifications
              about changes to subscriptions, which is why the information
              listed above is stored.
            </p>
          </div>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"text-2xl"}>Processing of personal data</h2>
            <p>
              Some personal data are only processed, and never stored, or even
              used. In addition to the data listed above, the following personal
              data are processed:
            </p>
            <ul className={"list-disc ml-5"}>
              <li>
                Transaction information provided by Ko-fi. For an exhaustive
                list of these data, please refer to{" "}
                <Link
                  className={`${mono.className} break-all underline transition-colors hover:text-blue-500`}
                  href={"https://ko-fi.com/manage/webhooks"}
                >
                  https://ko-fi.com/manage/webhooks
                </Link>
              </li>
              <li>
                Discord user information. These data are publicly available
                through the Discord API. For an exhaustive list of these data,
                please refer to{" "}
                <Link
                  className={`${mono.className} break-all underline transition-colors hover:text-blue-500`}
                  href={
                    "https://discord.com/developers/docs/resources/user#user-object"
                  }
                >
                  https://discord.com/developers/docs/resources/user#user-object
                </Link>
              </li>
              <li>
                Discord member information. These data are available through the
                Discord API by anyone that&apos;s in the server. For an
                exhaustive list of these data, please refer to{" "}
                <Link
                  className={`${mono.className} break-all underline transition-colors hover:text-blue-500`}
                  href={
                    "https://discord.com/developers/docs/resources/guild#guild-member-object"
                  }
                >
                  https://discord.com/developers/docs/resources/guild#guild-member-object
                </Link>
              </li>
            </ul>
          </div>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"text-2xl"}>Storage of logs</h2>
            <p>
              The software I run to provide my services, such as the webserver,
              store various logs regarding the usage of my services. These logs
              can be used for troubleshooting, and are cleared every once in a
              while. Depending on the logging level, these logs may include any
              of the information sent to my webserver. Generally, these logs are
              only created when an error occurs, and only the request headers,
              request method, request path and source IP address are stored. For
              an exhaustive list of which data this may include, please consult
              the <span className={mono.className}>Network</span> tab in your
              browser&apos;s{" "}
              <span className={mono.className}>Developer Tools</span>.
            </p>
          </div>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"text-2xl"}>Your data and third-party services</h2>
            <p>
              To protect myself, my services, and the end-user, I make use of
              various third-party services and tools. The only service that
              makes use of your data is Cloudflare, which is essentially a
              middle-man between my services and the end-user, and provides
              various benefits to me.
            </p>
            <p>
              Any data sent to the invite service passes through
              Cloudflare&apos;s network. Furthermore, Cloudflare aggregates the
              data it processes and provides me with anonymous statistics
              regarding the usage of my services. For more information, please
              refer to{" "}
              <Link
                className={`${mono.className} break-all underline transition-colors hover:text-blue-500`}
                href={"https://www.cloudflare.com/privacypolicy/"}
              >
                https://www.cloudflare.com/privacypolicy/
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
