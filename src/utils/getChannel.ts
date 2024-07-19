import { DiscordClient } from "@/lib/client"


export async function getChannelIds( serverId: string) {
  const client = DiscordClient.getInstance()
  const discordServer = client.guilds.cache.get(serverId);
  return discordServer ? Array.from(discordServer.channels.cache.values()) : []
}
