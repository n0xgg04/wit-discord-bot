import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { Message } from "discord.js";
import prisma from "../../../../prisma/client";
import _ from "lodash";

@MessageListener([Filter.includes("*chotuirole")])
class UserGetRole implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        const user = await prisma.discordMember.count({
            where: {
                discordId: message.author.id,
            },
        });

        if (user != 0) {
            await message.reply({
                content: `Bạn đã có trong danh sách thành viên! Để cấp role lại, hãy tag Mentor`,
            });
            return;
        }

        let role = message.guild!.roles.cache.find((r) => r.name === "WIT2024");
        let pw = message.id.concat(_.random(1, 1000).toString());
        try {
            await Promise.all([
                prisma.discordMember.create({
                    data: {
                        discordId: message.author.id,
                        missTime: 0,
                        username: message.author.username,
                    },
                }),
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
                    content: `<:chotuirole:1263873531460976640> Đã cấp role! Bạn có thể nhìn thấy các phòng meeting!`,
                }),
                message.author.send({
                    content: `<:chotuirole:1263873531460976640> Bạn đã được thêm vào role WIT 2024. Dưới đây là tài khoản đăng nhập WIT của bạn. Không chia sẻ nó tới bất kỳ ai: 
 Username: ${message.author.username} - Password: ||${pw}||`,
                }),
            ]);
        } catch (e) {
            await message.reply({
                content: `Không thể cấp role.`,
            });
        }
    }
}

export default UserGetRole;
