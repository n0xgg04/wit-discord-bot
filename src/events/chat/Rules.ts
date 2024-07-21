import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { Message } from "discord.js";
import { quydinh } from "@/constants";

@MessageListener([Filter.includes("*quydinh")])
class Rule implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        await message.reply({
            content: quydinh,
        });
    }
}

export default Rule;
