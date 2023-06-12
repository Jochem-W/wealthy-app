import { jwtVerify } from "jose"
import { createSecretKey } from "crypto"
import { Variables } from "@/utils/variables"

const key = createSecretKey(Variables.secretKey, "utf-8")

export const getSubject = async (token: unknown) => {
  if (typeof token !== "string") {
    return null
  }

  let payload
  try {
    const result = await jwtVerify(token, key)
    payload = result.payload
  } catch (e) {
    return null
  }

  if (!payload.sub) {
    return null
  }

  return payload.sub
}
