const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ig")
    .setDescription("Arruma os embeds do instagram")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("link da postagem no instagram (pode ser reels também)")
        .setRequired(true)
    ),
  async execute(interaction) {
    let input = interaction.options.getString("link");
    let isInstagramLink = /https?:\/\/(www\.)?instagram\.com/.test(input);

    if (isInstagramLink) {
      input = input.replace("instagram", "ddinstagram");
      await interaction.deferReply();
      await wait(1_000);
      await interaction.editReply({
        content: input,
      });
    } else if (/https?:\/\/(www\.)?ddinstagram\.com/.test(input)) {
      await interaction.reply({
        content: "Esse link já tá arrumado seu animal",
      });
    } else {
      await interaction.reply({
        content: "Link inválido, confira se o link informado é do instagram",
      });
    }
  },
};
