import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { Message } from "discord.js";
import MessageData from "@/lib/decorators/Message";
import { isAdmin } from "@/utils/isAdmin";
import prisma from "../../../../prisma/client";

@MessageListener([Filter.startWith("*addmember")])
class AddMember implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        try {
            if (!(await isAdmin(message.author.id))) {
                await message.reply({
                    content: `Không phải admin!`,
                });
                return;
            }
            const users = message.mentions.users;
            await prisma.discordMember.createMany({
                data: users.map((user) => ({
                    discordId: user.id,
                })),
            });
            await message.reply({
                content: `Đã thêm ${users.size} thành viên`,
            });
        } catch (e) {
            await message.reply({
                content: `Có lỗi xảy ra ${(e as Error).toString()}`,
            });
        }
    }
}

export default AddMember;
