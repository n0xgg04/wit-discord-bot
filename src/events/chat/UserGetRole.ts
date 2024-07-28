import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { EmbedBuilder, Message } from "discord.js";
import _ from "lodash";
import prisma from "@database/client";

@MessageListener([Filter.includes("*chotuirole")])
class UserGetRole implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        const user = await prisma.member.count({
            where: {
                memberId: message.author.id,
            },
        });

        if (user != 0) {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xe82626)
                        .setTitle("Role")
                        .setAuthor({ name: "WIT 2024" })
                        .setDescription("Bạn đã có role rồi!"),
                ],
            });
            return;
        }

        let role = message.guild!.roles.cache.find((r) => r.name === "WIT2024");
        let pw = message.id.concat(_.random(1, 1000).toString());

        try {
            await Promise.all([
                prisma.member.create({
                    data: {
                        username: message.author.username,
                        password: pw,
                        memberId: message.author.id,
                        email: message.author.username,
                    },
                }),
                message.member!.roles.add(role!),
                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x29c45a)
                            .setTitle("Role")
                            .setAuthor({ name: "WIT 2024" })
                            .setDescription("Cấp role thành công!"),
                    ],
                }),
                message.author.send({
                    content: `<:chotuirole:1263873531460976640> Bạn đã được thêm vào role WIT 2024. Dưới đây là tài khoản đăng nhập WIT của bạn. Không chia sẻ nó tới bất kỳ ai: 
 Username: ${message.author.username} - Password: ||${pw}||`,
                }),
            ]);
        } catch (e) {
            await message.reply({
                content: `Không thể cấp role.` + (e as Error).toString(),
            });
        }
    }
}

export default UserGetRole;
