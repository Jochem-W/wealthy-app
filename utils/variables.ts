import { z } from "zod"
import camelcaseKeys from "camelcase-keys"

const model = z
  .object({
    SECRET_KEY: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    GUILD_ID: z.string(),
    GRACE_PERIOD: z.coerce.number(),
    DATABASE_URL: z.string(),
    INVITE_TIERS: z
      .string()
      .transform((arg) => JSON.parse(arg.replaceAll("'", '"')) as string[]),
    DISCORD_TIERS: z
      .string()
      .transform((arg) => JSON.parse(arg.replaceAll("'", '"')) as string[]),
    UNSUBCRIBED_ROLE: z.string(),
  })
  .transform((arg) => camelcaseKeys(arg))

export const Variables = model.parse(process.env)
