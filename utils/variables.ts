import { z } from "zod"
import camelcaseKeys from "camelcase-keys"

const model = z
  .object({
    SECRET_KEY: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    GUILD_ID: z.string(),
    GRACE_PERIOD: z.coerce.number(),
    DATABASE_URL: z.string(),
  })
  .transform((arg) => camelcaseKeys(arg))

export const Variables = model.parse(process.env)
