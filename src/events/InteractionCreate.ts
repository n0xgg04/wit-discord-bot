import EventModule from "@/lib/decorators/EventModule";
import { EmbedBuilder, Interaction } from "discord.js";
import prisma from "@database/client";
import message from "@/lib/decorators/Message";

@EventModule({
    Event: "InteractionCreate",
    Handler: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        const { customId } = interaction;

        if (customId.startsWith("ask")) {
            const parse = customId.split("~");
            const questionId = Number(parse[1]);
            const chosen = Number(parse[2]);
            const ques = await prisma.meetQuestions.findFirst({
                where: {
                    id: questionId,
                },
            });

            const check = await prisma.userAnswerQuestion.findFirst({
                where: {
                    memberId: interaction.user.id,
                    questionId: questionId,
                },
            });

            if (check) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xe82626)
                            .setTitle("Bạn đã trả lời trước đó!")
                            .setAuthor({ name: "Thất bại!" }),
                    ],
                    ephemeral: true,
                });
                return;
            }

            if (ques?.anwser == chosen) {
                const user = await prisma.member.findUnique({
                    where: {
                        memberId: interaction.user.id,
                    },
                });
                if (!user) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xe82626)
                                .setTitle("Bạn cần có role")
                                .setAuthor({ name: "Thất bại!" })
                                .setDescription(
                                    "Hãy nhập *chotuirole để lấy role trước!",
                                ),
                        ],
                        ephemeral: true,
                    });
                    return;
                }
                await Promise.all([
                    prisma.userAnswerQuestion.create({
                        data: {
                            memberId: user.memberId,
                            questionId: questionId,
                        },
                    }),
                    prisma.member.update({
                        where: {
                            memberId: interaction.user.id,
                        },
                        data: {
                            points: user.points + ques.coin,
                        },
                    }),
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x29c45a)
                                .setTitle("Chính xác!")
                                .setAuthor({ name: `Câu hỏi tương tác:` })
                                .setDescription(
                                    `Bạn đã trả lời đúng câu hỏi và nhận ${ques.coin} WIT\nTổng WIT đang có: ${ques.coin + user.points} WIT`,
                                )
                                .setFooter({
                                    text: `Nhập *diem để xem số điểm hiện có\nNhập *rank để xem bảng xếp dạng`,
                                }),
                        ],
                        ephemeral: true,
                    }),
                ]);
            } else {
                await Promise.all([
                    prisma.userAnswerQuestion.create({
                        data: {
                            memberId: interaction.user.id,
                            questionId: questionId,
                        },
                    }),
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xe82626)
                                .setTitle("Sai rồi!")
                                .setAuthor({
                                    name: "Chúc bạn may mắn lần sau!",
                                }),
                        ],
                        ephemeral: true,
                    }),
                ]);
            }
        }
    },
})
class InteractionCreate {}

export default InteractionCreate;
