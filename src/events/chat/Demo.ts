import MessageListener from "@/lib/decorators/MessageListener";
import { Filter } from "@/lib/filter";
import { IMessageListenerHandler } from "@/lib/interfaces/IMessageListenerHandler";
import { EmbedBuilder, Message } from "discord.js";
import MessageData from "@/lib/decorators/Message";
import { isAdmin } from "@/utils/isAdmin";
import prisma from "@database/client";

@MessageListener([Filter.startWith("*demo")])
class Demo implements IMessageListenerHandler {
    async handler(@MessageData() message: Message) {
        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xc45a29)
                    .setTitle("LTA depchai 0?")
                    .setDescription("```A. Có\nB.Có\nC.Có\nD.Có```")
                    .setFooter({
                        text: "Chọn câu trả lời:",
                    }),
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 1,
                            label: "A",
                            custom_id: "B",
                        },
                    ],
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 1,
                            label: "B",
                            custom_id: "C",
                        },
                    ],
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 1,
                            label: "C",
                            custom_id: "D",
                        },
                    ],
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 1,
                            label: "D",
                            custom_id: "send_application",
                        },
                    ],
                },
            ],
        });
    }
}

export default Demo;
