import { jwtVerify } from "jose"
import { createSecretKey } from "crypto"

const key = createSecretKey(process.env["SECRET_KEY"] as string, "utf-8")

export const getInviter = async (token: unknown) => {
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