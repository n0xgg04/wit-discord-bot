import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { EmbedBuilder, Message } from "discord.js";
import MessageData from "@/lib/decorators/Message";
import prisma from "@database/client";

@MessageListener([Filter.startWith("*rank")])
class Leaderboard implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        try {
            const ranking = await prisma.member.findMany({
                orderBy: {
                    points: "desc",
                },
                take: 20,
                select: {
                    username: true,
                    memberId: true,
                    points: true,
                },
            });

            let leaderboard = "";
            ranking.forEach((e, i) => {
                leaderboard += `**#${i + 1}**: <@${e.memberId}> - ${e.points} WIT\n`;
            });

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x29c45a)
                        .setTitle("WIT Ranking")
                        .setAuthor({ name: "WIT 2024" })
                        .setDescription(leaderboard),
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

export default Leaderboard;
