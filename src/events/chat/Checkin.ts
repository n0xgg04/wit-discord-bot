import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { EmbedBuilder, Message } from "discord.js";
import MessageData from "@/lib/decorators/Message";
import prisma from "@database/client";
import { query } from "@redis/utils/query";

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

            if (!meeting.isAllowCheckIn) {
                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xc45a29)
                            .setTitle("Checkin")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription("Không được phép checkin bây giờ!")
                            .setFooter({
                                text: "Bạn chỉ được phép checkin trong thời gian Mentor quy định",
                            }),
                    ],
                });
                return;
            }

            const users = await prisma.userJoinMeet.findFirst({
                where: {
                    discordMemberId: message.author.id,
                    meetId: meeting.id,
                },
            });

            if (users) {
                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xe82626)
                            .setTitle("Checkin")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription("Bạn đã điểm danh trước đó rồi!"),
                    ],
                });
                return;
            }

            const isMember = await prisma.member.findUnique({
                where: {
                    memberId: message.author.id,
                },
            });

            if (!isMember) {
                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xe82626)
                            .setTitle("Checkin")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription(
                                "Không nằm trong danh sách thành viên! Dùng lệnh *chotuirole để lấy role và đăng ký thành viên!",
                            ),
                    ],
                });
                return;
            }

            await prisma.userJoinMeet.create({
                data: {
                    meetId: meeting.id,
                    discordMemberId: message.author.id,
                },
            });

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x29c45a)
                        .setTitle("Checkin")
                        .setAuthor({ name: "WIT 2024" })
                        .setDescription("Checkin thành công!"),
                ],
            });
        } catch (e) {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xe82626)
                        .setTitle("Checkin")
                        .setAuthor({ name: "WIT 2024" })
                        .setDescription("Điểm danh thất bại do lỗi hệ thống!")
                        .setFooter({
                            text: "Lỗi:" + (e as Error).toString(),
                        }),
                ],
            });
        }
    }
}

export default CheckIn;
