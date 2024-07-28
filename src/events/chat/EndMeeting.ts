import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { isAdmin } from "@/utils/isAdmin";
import channels from "@/constants";
import Client from "@/lib/decorators/Client";
import { DiscordClient } from "@/lib/client";
import prisma from "@database/client";

@MessageListener([Filter.startWith("*end meeting")])
class CheckIn implements IMessageListenerHandler {
    async handler(
        @MessageData() message: Message,
        @Client client: DiscordClient,
    ) {
        try {
            if (!(await isAdmin(message.author.id))) {
                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x0099ff)
                            .setTitle("Meeting")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription("Không có quyền dùng lệnh này!")
                            .setFooter({
                                text: "Chỉ admin mới có quyền sử dụng lệnh này...",
                            }),
                    ],
                });
                return;
            }

            const meeting = await prisma.discordMeet.findUnique({
                where: {
                    channel: message.channel.id,
                    isActive: true,
                },
            });

            if (!meeting) {
                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x0099ff)
                            .setTitle("Meeting")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription(
                                "Meeting không tồn tại tại kênh này...",
                            ),
                    ],
                });
                return;
            }

            const allTrackingUser = await prisma.member.findMany();
            const channel = client.channels.cache.find(
                (ch) => ch.id === channels.notifyChannel,
            );

            const userJoin = await prisma.userJoinMeet.findMany({
                where: {
                    meetId: meeting.id,
                },
            });

            const notifyNonJoinMember = new Promise(async (resolve, reject) => {
                const users = userJoin.map((el) => el.discordMemberId);
                for (const user of allTrackingUser) {
                    if (!users.includes(user.memberId)) {
                        if (user.missTime == 2) {
                            try {
                                await message.guild!.members.kick(
                                    user.memberId,
                                    "Kick do quá 2 lần không tham gia meet!",
                                );
                            } catch (e) {
                                message.reply({
                                    content: `Không thể KICK do ${(e as Error).toString()}`,
                                });
                                return;
                            }

                            await (<TextChannel>channel).send(
                                `<@${user.memberId}> aka ${user.username} đã bị KICK khỏi nhóm do quá 2 lần không tham gia meet.`,
                            );

                            await prisma.member.update({
                                where: {
                                    memberId: user.memberId,
                                },
                                data: {
                                    missTime: 0,
                                },
                            });
                        } else {
                            (<TextChannel>channel).send(
                                `Cảnh báo: <@${user.memberId}> không tham gia meeting lúc ${new Date(meeting.createdAt).toLocaleString("vi-VN")}, quá 2 lần, bạn sẽ tự động bị KICK!`,
                            );
                            await prisma.member.update({
                                where: {
                                    memberId: user.memberId,
                                },
                                data: {
                                    missTime: user.missTime + 1,
                                },
                            });
                        }
                    }
                }
            });

            await Promise.all([
                prisma.discordMeet.delete({
                    where: {
                        channel: message.channel.id,
                    },
                }),
                notifyNonJoinMember,
                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x29c45a)
                            .setTitle("Meeting")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription(
                                "Buổi học đã kết thúc. Cảm ơn các bạn đã tham gia!",
                            ),
                    ],
                }),
            ]);
        } catch (e) {
            await message.reply({
                content: `Có lỗi xảy ra ${(e as Error).toString()}`,
            });
        }
    }
}

export default CheckIn;
