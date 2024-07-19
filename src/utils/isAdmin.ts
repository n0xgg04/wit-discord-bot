import prisma from "../../../prisma/client";

export async function isAdmin(id: string) {
    return (
        (await prisma.discordAdminId.count({
            where: {
                discordId: id,
            },
        })) > 0
    );
}
