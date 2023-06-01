import { z } from "zod"
import camelcaseKeys from "camelcase-keys"

const model = z
  .object({
    SECRET_KEY: z.string(),
    CLIENT_ID: z.string(),
    CLIENT_SECRET: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    GUILD_ID: z.string(),
  })
  .transform((arg) => camelcaseKeys(arg))

export const Variables = model.parse(process.env)
