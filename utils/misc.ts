import { usersTable } from "@/schema"
import { Variables } from "@/utils/variables"
import { DateTime } from "luxon"

export function expiredMillis(user: typeof usersTable.$inferSelect) {
  return DateTime.fromJSDate(user.lastPaymentTimestamp)
    .plus({ days: 30 + Variables.gracePeriod })
    .diffNow()
    .toMillis()
}
