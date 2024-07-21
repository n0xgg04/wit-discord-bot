import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { Message } from "discord.js";

@MessageListener([Filter.includes("*id")])
class GetId implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        await message.reply({
            content: message.author.id,
        });
    }
}

export default GetId;
