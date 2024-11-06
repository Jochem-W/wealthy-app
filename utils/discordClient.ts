import { APIUser } from "discord-api-types/v10"

export function displayName(user: APIUser) {
  return user.global_name ?? user.username
}

export function displayAvatarUrl(user: APIUser) {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`
  }

  if (user.discriminator !== "0") {
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator, 10) % 5}.png`
  }

  return `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> BigInt(22)) % BigInt(6))}.png`
}
