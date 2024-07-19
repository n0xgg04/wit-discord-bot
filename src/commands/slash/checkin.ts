import { SlashCommand, SlashCommandConfig } from "@/types/command";
import prisma from "../../../../prisma/client";

const config: SlashCommandConfig = {
    description: "Điểm danh",
    usage: "/checkin",
};

const command: SlashCommand = {
    execute: async (interaction) => {
        const channelId = interaction.channelId;
        await interaction.reply({
            content: "Đang kiểm tra...",
            fetchReply: true,
        });

        try {
            const meeting = await prisma.discordMeet.findUnique({
                where: {
                    channel: channelId,
                    isActive: true,
                },
            });

            if (!meeting) {
                await interaction.editReply(`Meeting không tồn tại...`);
                return;
            }

            const users = meeting.joined.split(" ");
            if (users.includes(interaction.user.id)) {
                await interaction.editReply(`Bạn đã điểm danh trước đó rồi...`);
                return;
            }

            await prisma.discordMeet.update({
                where: {
                    id: meeting.id,
                },
                data: {
                    joined: [...users, interaction.user.id].join(" "),
                },
            });
            await interaction.editReply(`Đã điểm danh thành công`);
        } catch (e) {
            await interaction.editReply(
                `Đã điểm danh thất bại (error: ${(e as Error).toString()})`,
            );
        }
    },
};

export default { command, config };
