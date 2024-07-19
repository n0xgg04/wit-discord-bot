import { SlashCommand, SlashCommandConfig } from "@/types/command"

const config: SlashCommandConfig = {
  description: "Show the latency of the bot",
  usage: "/ping",
  options: [
    {
      name: "emoji",
      description: "The emoji to use",
      type: "STRING",
      required: false,
    },
  ],
}

const command: SlashCommand = {
  // permissions: 0,
  execute: async (interaction) => {
    const ping = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    })


    await interaction.editReply(
      `Djt cai ditmemay.`
    )
  },
}

export default { command, config }
