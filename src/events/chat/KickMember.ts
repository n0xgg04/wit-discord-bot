import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { Message } from "discord.js";
import { isAdmin } from "@/utils/isAdmin";

@MessageListener([Filter.startWith("*kick")])
class KickMember implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        if (!(await isAdmin(message.author.id))) {
            await message.reply({
                content: `Không phải admin!`,
            });
            return;
        }
        const users = message.mentions.users;
        users.forEach((user) =>
            message.guild!.members.kick(user.id, "Admin kick bạn!"),
        );
        await message.reply({
            content: `Đã kick ra khỏi nhóm!`,
        });
    }
}

export default KickMember;
