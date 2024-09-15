const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Replies with your input!")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Message to echo back")
        .setRequired(true)
    ),
    async execute(interaction){
        const input = interaction.options.getString("input")
        await interaction.reply({
            content: input
        });
    }
};
