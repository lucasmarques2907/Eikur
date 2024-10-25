const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tw")
    .setDescription("Arruma os embeds do twitter")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("link da postagem no twitter")
        .setRequired(true)
    ),
  async execute(interaction) {
    let input = interaction.options.getString("link");
    let isTwitterLink = /https?:\/\/(www\.)?x\.com/.test(input);

    if (isTwitterLink) {
      input = input.replace("x", "fixupx");
      await interaction.deferReply();
      await wait(1_000);
      await interaction.editReply({
        content: input,
      });
    } else if (/https?:\/\/(www\.)?fixupx\.com/.test(input)) {
      await interaction.reply({
        content: "Esse link já tá arrumado seu animal",
      });
    }
    else if( input == "link válido" || input == "link valido"){
      await interaction.reply({
        content: "ඞ"
      })
    }
    else {
      await interaction.reply({
        content: "Link inválido, confira se o link informado é do twitter",
      });
    }
  },
};
