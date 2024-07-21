import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { Message, TextChannel } from "discord.js";
import prisma from "../../../../prisma/client";
import { isAdmin } from "@/utils/isAdmin";
import channels from "@/constants";
import Client from "@/lib/decorators/Client";
import { DiscordClient } from "@/lib/client";

@MessageListener([Filter.startWith("*end meeting")])
class CheckIn implements IMessageListenerHandler {
    async handler(
        @MessageData() message: Message,
        @Client client: DiscordClient,
    ) {
        try {
            if (!(await isAdmin(message.author.id))) {
                await message.reply({
                    content: `Không phải admin!`,
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
                    content: `Meeting không tồn tại...`,
                });
                return;
            }

            const allTrackingUser = await prisma.discordMember.findMany();
            const channel = client.channels.cache.find(
                (ch) => ch.id === channels.notifyChannel,
            );

            const users = meeting.joined.split(" ");
            for (const user of allTrackingUser) {
                if (!users.includes(user.discordId)) {
                    if (user.missTime == 2) {
                        try {
                            await message.guild!.members.kick(
                                user.discordId,
                                "Kick do quá 2 lần không tham gia meet!",
                            );
                        } catch (e) {
                            message.reply({
                                content: `Không thể KICK do ${(e as Error).toString()}`,
                            });
                            return;
                        }

                        await (<TextChannel>channel).send(
                            `<@${user.discordId}> aka ${user.username} đã bị KICK khỏi nhóm do quá 2 lần không tham gia meet.`,
                        );

                        await prisma.discordMember.update({
                            where: {
                                discordId: user.discordId,
                            },
                            data: {
                                missTime: 0,
                            },
                        });
                    } else {
                        (<TextChannel>channel).send(
                            `Cảnh báo: <@${user.discordId}> không tham gia meeting lúc ${new Date(meeting.createdAt).toLocaleString("vi-VN")}, quá 2 lần, bạn sẽ tự động bị KICK!`,
                        );
                        await prisma.discordMember.update({
                            where: {
                                discordId: user.discordId,
                            },
                            data: {
                                missTime: user.missTime + 1,
                            },
                        });
                    }
                }
            }

            await prisma.discordMeet.delete({
                where: {
                    channel: message.channel.id,
                },
            });

            await message.reply({
                content: `Buổi meet đã kết thúc! Cảm ơn các bạn đã tham gia...`,
            });
        } catch (e) {
            await message.reply({
                content: `Có lỗi xảy ra ${(e as Error).toString()}`,
            });
        }
    }
}

export default CheckIn;
