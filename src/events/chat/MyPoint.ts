import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { EmbedBuilder, Message } from "discord.js";
import MessageData from "@/lib/decorators/Message";
import prisma from "@database/client";

@MessageListener([Filter.startWith("*diem")])
class MyPoint implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        try {
            const users = await prisma.member.findUnique({
                where: {
                    memberId: message.author.id,
                },
            });

            if (!users || !users.username) {
                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xe82626)
                            .setTitle("Kiểm tra điểm")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription("Không tồn tại người dùng..."),
                    ],
                });
                return;
            }

            const members = await prisma.member.findUnique({
                where: {
                    username: users.username,
                },
            });

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x29c45a)
                        .setTitle("WIT Scores")
                        .setAuthor({ name: "WIT 2024" })
                        .setDescription(
                            `Bạn đã tích luỹ được ${members?.points} điểm`,
                        ),
                ],
            });
        } catch (e) {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xe82626)
                        .setTitle("Điểm")
                        .setAuthor({ name: "WIT 2024" })
                        .setDescription("Có lỗi xảy ra!")
                        .setFooter({
                            text: "Lỗi:" + (e as Error).toString(),
                        }),
                ],
            });
        }
    }
}

export default MyPoint;
