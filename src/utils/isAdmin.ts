import prisma from "@database/client";

export async function isAdmin(id: string) {
    return (
        (await prisma.discordAdminId.count({
            where: {
                discordId: id,
            },
        })) > 0
    );
}
