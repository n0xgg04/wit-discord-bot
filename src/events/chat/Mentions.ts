import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { Message, TextChannel, VoiceChannel } from "discord.js";
import channels from "@/constants";
import Client from "@/lib/decorators/Client";
import { DiscordClient } from "@/lib/client";

@MessageListener([Filter.includes("@"), Filter.not(Filter.startWith("*"))])
class Mention implements IMessageListenerHandler {
    async handler(
        @MessageData() message: Message,
        @Client client: DiscordClient,
    ) {
        const mentions = message.mentions.users;
        const allMem = mentions.map((user) => user.id);
        const channel = client.channels.cache.find(
            (ch) => ch.id === channels.notifyChannel,
        );
        allMem.forEach((mem) => {
            (<TextChannel>channel).send(
                `<@${message.author.id}> đã tag <@${mem}> tại channel <#${message.channelId}>`,
            );
        });
    }
}

export default Mention;
