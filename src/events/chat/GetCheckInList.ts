import prisma from "../../../../prisma/client";
import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { Message } from "discord.js";

@MessageListener([Filter.includes("*checkedin")])
class GetCheckInList implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        try {
            const meeting = await prisma.discordMeet.findUnique({
                where: {
                    channel: message.channel.id,
                    isActive: true,
                },
            });
            if (!meeting) {
                await message.reply({
                    content: `Meeting không tồn tại...`,
                });
            } else {
                const users = meeting.joined.split(" ");
                let userTag = "";
                for (let i = 1; i < users.length; i++) {
                    userTag += ` <@${users[i]}>`;
                }
                await message.reply({
                    content: `Danh sách điểm danh (${users.length - 1}): ${userTag}`,
                });
            }
        } catch (e) {
            await message.reply({
                content: `Lấy danh sách thất bại! (error: ${(e as Error).toString()})`,
            });
        }
    }
}

export default GetCheckInList;
