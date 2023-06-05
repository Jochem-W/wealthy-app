import { Variables } from "@/utils/variables"
import { DateTime } from "luxon"
import type { User } from "@prisma/client"

export function expiredMillis(user: User) {
  return DateTime.fromJSDate(user.lastPaymentTime)
    .plus({ days: 30 + Variables.gracePeriod })
    .diffNow()
    .toMillis()
}
