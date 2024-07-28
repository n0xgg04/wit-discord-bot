import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { Message, VoiceChannel } from "discord.js";
import { getChannelIds } from "@/utils/getChannel";
import _ from "lodash";
import prisma from "@database/client";

@MessageListener([Filter.startWith("*meeting now")])
class Meeting implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        const serverId = message.guild?.id;
        const channels = await getChannelIds(serverId!);
        const voices = channels.filter((chan) => {
            return (
                chan instanceof VoiceChannel &&
                chan.name != "Lofi Chill" &&
                chan.name != "ZZZ"
            );
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
                            isActive: true,
                            channel: room!,
                            isAllowCheckIn: false,
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
    }
}

export default Meeting;
