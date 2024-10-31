const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    await interaction.editReply({
        content: `Pong! (${sent.createdTimestamp - interaction.createdTimestamp}ms)`,
    });
  },
};
