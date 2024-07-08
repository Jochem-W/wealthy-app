import { integer, pgTable, text } from "drizzle-orm/pg-core"

export const birthdaysTable = pgTable("birthday", {
  id: text("id").primaryKey(),
  month: integer("month").notNull(),
  day: integer("day").notNull(),
})
