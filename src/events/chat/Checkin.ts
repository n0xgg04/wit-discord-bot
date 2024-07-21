import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { Message } from "discord.js";
import MessageData from "@/lib/decorators/Message";
import prisma from "../../../../prisma/client";

@MessageListener([Filter.startWith("*checkin")])
class CheckIn implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        const channelId = message.channelId;

        try {
            const meeting = await prisma.discordMeet.findUnique({
                where: {
                    channel: channelId,
                    isActive: true,
                },
            });

            if (!meeting) {
                await message.reply({
                    content: `Meeting không tồn tại...`,
                });
                return;
            }

            const users = meeting.joined.split(" ");
            if (users.includes(message.author.id)) {
                await message.reply({
                    content: `Bạn đã điểm danh trước đó rồi...`,
                });
                return;
            }

            await prisma.discordMeet.update({
                where: {
                    id: meeting.id,
                },
                data: {
                    joined: [...users, message.author.id].join(" "),
                },
            });
            await message.reply({
                content: `<:diemdanh:1263879058375180349> Đã điểm danh thành công`,
            });
        } catch (e) {
            await message.reply({
                content: `Đã điểm danh thất bại (error: ${(e as Error).toString()})`,
            });
        }
    }
}

export default CheckIn;
