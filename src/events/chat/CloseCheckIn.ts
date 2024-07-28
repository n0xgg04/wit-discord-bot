import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { Message } from "discord.js";
import MessageData from "@/lib/decorators/Message";
import { isAdmin } from "@/utils/isAdmin";
import prisma from "@database/client";

@MessageListener([Filter.startWith("*allowcheckin")])
class CloseCheckin implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        try {
            if (!(await isAdmin(message.author.id))) {
                await message.reply({
                    content: `Không phải admin!`,
                });
                return;
            }

            await prisma.discordMeet.update({
                where: {
                    channel: message.channel.id,
                },
                data: {
                    isAllowCheckIn: false,
                },
            });

            await message.reply({
                content: `Đã mở check in`,
            });
        } catch (e) {
            await message.reply({
                content: `Có lỗi xảy ra ${(e as Error).toString()}`,
            });
        }
    }
}

export default CloseCheckin;
