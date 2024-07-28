import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { EmbedBuilder, Message } from "discord.js";
import MessageData from "@/lib/decorators/Message";
import { isAdmin } from "@/utils/isAdmin";
import prisma from "@database/client";

@MessageListener([Filter.startWith("*allow_checkin")])
class AllowCheckIn implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        try {
            if (!(await isAdmin(message.author.id))) {
                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xc45a29)
                            .setTitle("Checkin")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription("Không có quyền sử dụng.")
                            .setFooter({
                                text: "Chỉ admin mới có quyền dụng lệnh này.",
                            }),
                    ],
                });
                return;
            }

            await prisma.discordMeet.update({
                where: {
                    channel: message.channel.id,
                },
                data: {
                    isAllowCheckIn: true,
                },
            });

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x29c45a)
                        .setTitle("Checkin")
                        .setAuthor({ name: "WIT 2024" })
                        .setDescription("Đã cho phép checkin!")
                        .setFooter({
                            text: "Các thành viên có thể checkin từ bây giờ nhé!",
                        }),
                ],
            });
        } catch (e) {
            await message.reply({
                content: `Có lỗi xảy ra ${(e as Error).toString()}`,
            });
        }
    }
}

export default AllowCheckIn;
