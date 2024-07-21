import { Message } from "discord.js";
import { DiscordClient } from "@/lib/client";

export interface IMessageListenerHandler {
    handler(message?: any, client?: DiscordClient): Promise<any>;
}
