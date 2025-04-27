const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Converte valores entre moedas usando Frankfurter.app")
    .addStringOption((option) =>
      option
        .setName("de")
        .setDescription("Moeda de origem (ex: USD)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("para")
        .setDescription("Moeda de destino (ex: BRL)")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("valor")
        .setDescription("Valor a ser convertido")
        .setRequired(true)
    ),

  async execute(interaction) {
    const from = interaction.options.getString("de").toUpperCase();
    const to = interaction.options.getString("para").toUpperCase();
    const amount = interaction.options.getNumber("valor");

    try {
      const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}&amount=${amount}`;
      const response = await axios.get(url);
      const converted = response.data.rates[to];
      const date = response.data.date;

      const embed = new EmbedBuilder()
        .setColor(0x1abc9c)
        .setTitle("💰 Conversão de Moedas")
        .setDescription(`**${from} ➡️ ${to}**\nCotação atual de ${date}`)
        .addFields(
          {
            name: "Valor Original",
            value: `\`${amount.toFixed(2)} ${from}\``,
            inline: true,
          },
          {
            name: "Valor Convertido",
            value: `\`${converted.toFixed(2)} ${to}\``,
            inline: true,
          },
          {
            name: "Taxa de Câmbio",
            value: `\`1 ${from} = ${(converted / amount).toFixed(4)} ${to}\``,
            inline: false,
          }
        )
        .setFooter({
          text: "Dados via Frankfurter.app",
          iconURL: "https://frankfurter.dev/favicon.png?v=1740482194",
        })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro na API de câmbio:", error.message);
      await interaction.reply(
        "❌ Ocorreu um erro ao obter a taxa de câmbio. Verifique os códigos das moedas."
      );
    }
  },
};
