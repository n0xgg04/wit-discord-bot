import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import MessageData from "@/lib/decorators/Message";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import Client from "@/lib/decorators/Client";
import { DiscordClient } from "@/lib/client";
import prisma from "@database/client";
import { isAdmin } from "@/utils/isAdmin";
import moment from "moment-timezone";

moment.tz("Asia/Ho_Chi_Minh");
@MessageListener([Filter.startWith("*ask")])
class Ask implements IMessageListenerHandler {
    async handler(
        @MessageData() message: Message,
        @Client client: DiscordClient,
    ) {
        if (!(await isAdmin(message.author.id))) {
            await message.reply({
                content: `Không phải admin!`,
            });
            return;
        }
        const ques = message.content.split("~");

        const data = {
            coin: ques[2],
            correct: ques[3],
            sec: ques[4],
            question: ques[5],
            options: ques.splice(6),
        };

        const end = moment()
            .add({
                second: Number(data.sec),
            })
            .toDate();

        const quesNew = await prisma.meetQuestions.create({
            data: {
                question: data.question,
                options: JSON.stringify(data.options),
                anwser: Number(data.correct),
                endAt: end,
            },
        });

        const channel = client.channels.cache.find((ch) => ch.id === ques[1]);

        let desc = "";

        data.options.forEach((item, i) => {
            desc += `1. ${item}\n`;
        });

        (<TextChannel>channel).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x29c45a)
                    .setTitle(data.question)
                    .setAuthor({ name: `Câu hỏi tương tác:` })
                    .setDescription(desc)
                    .setFooter({
                        text: `#${quesNew.id} - ${data.coin} WIT\nTrả lời trước ${end.toLocaleString("vi-VN")}`,
                    }),
            ],
            components: data.options.map((opt, i) => ({
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 1,
                        label: `${i + 1}`,
                        custom_id: `ask~${quesNew.id}~${i}`,
                    },
                ],
            })),
        });
    }
}

export default Ask;
