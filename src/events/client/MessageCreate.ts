import { Message, TextChannel, VoiceChannel } from "discord.js";
import { getChannelIds } from "@/utils/getChannel";
import _ from "lodash";
import { DiscordClient } from "@/lib/client";
import channels, { quydinh } from "@/constants";
import prisma from "../../../../prisma/client";
import { isAdmin } from "@/utils/isAdmin";

export default async function (message: Message) {
    const client = DiscordClient.getInstance();
    if (message.author.bot) return;
    const serverId = message.guild?.id;
    if (message.content.startsWith("*meeting now")) {
        const channels = await getChannelIds(serverId!);
        const voices = channels.filter((chan) => {
            return chan instanceof VoiceChannel && chan.name != "Lofi Chill";
        });
        const voiceIdList = voices.map((voice) => voice.id);
        const room = voiceIdList.at(_.random(0, voiceIdList.length - 1));
        try {
            const isAdmin = await prisma.discordAdminId.count({
                where: {
                    discordId: message.author.id.toString(),
                },
            });

            if (isAdmin) {
                try {
                    await prisma.discordMeet.create({
                        data: {
                            joined: "",
                            isActive: true,
                            channel: room!,
                        },
                    });
                } catch (e) {
                    await message.reply({
                        content: `Lưu meet vào database thất bại (id: ${room}, err: ${(e as Error).toString()})!`,
                    });
                }
            }
        } catch (e) {
            await message.reply({
                content: `Không thể kết nối tới database!`,
            });
        }

        await message.reply({
            content: `Meet tại phòng <#${room}> !`,
        });
    } else if (message.content.startsWith("*add_member")) {
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
    } else if (message.content.includes("@")) {
        const mentions = message.mentions.users;
        const allMem = mentions.map((user) => user.id);
        const channel = client.channels.cache.find(
            (ch) => ch.id === channels.notifyChannel,
        );
        allMem.forEach((mem) => {
            (<TextChannel>channel).send(
                `<@${message.author.id}> đã tag <@${mem}> tại channel <#${message.channelId}>`,
            );
        });
    } else if (message.content.includes("*quydinh")) {
        await message.reply({
            content: quydinh,
        });
    } else if (message.content === "*id") {
        await message.reply({
            content: message.author.id,
        });
    } else if (message.content === "*channelId") {
        await message.reply({
            content: message.channelId,
        });
    } else if (message.content === "*checkin") {
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
                content: `Đã điểm danh thành công`,
            });
        } catch (e) {
            await message.reply({
                content: `Đã điểm danh thất bại (error: ${(e as Error).toString()})`,
            });
        }
    } else if (message.content == "*checkedin") {
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
    } else if (message.content === "*end meeting") {
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
                        await message.guild!.members.kick(
                            user.discordId,
                            "Kick do quá 2 lần không tham gia meet!",
                        );

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
                            `Cảnh báo: <@${user.discordId}> không tham gia meeting lúc ${new Date(meeting.createdAt).toLocaleString("vi-VN")}, quá 2 lần, bạn sẽ tự động bị KICK!}`,
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
