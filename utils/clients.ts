import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { Variables } from "./variables"

const globalForDrizzle = global as unknown as {
  drizzle: PostgresJsDatabase | undefined
}
export const Drizzle =
  globalForDrizzle.drizzle ?? drizzle(postgres(Variables.databaseUrl))

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.drizzle = Drizzle
}
