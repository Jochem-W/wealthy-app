import { z } from "zod"
import camelcaseKeys from "camelcase-keys"

const model = z
  .object({
    DISCORD_BOT_TOKEN: z.string(),
    GUILD_ID: z.string(),
    DATABASE_URL: z.string(),
    ROLES: z
      .string()
      .transform(
        (arg) => new Set(JSON.parse(arg.replaceAll("'", '"')) as string[]),
      ),
  })
  .transform((arg) => camelcaseKeys(arg))

export const Variables = model.parse(process.env)
