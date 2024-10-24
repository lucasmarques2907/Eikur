const { SlashCommandBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Faça uma pergunta para a IA!")
    .addStringOption((option) => option.setName("pergunta")
    .setDescription("Pergunta para a IA")
    .setRequired(true)),
  async execute(interaction) {
    const prompt = interaction.options.getString("pergunta");
    await interaction.reply({
      content: "Pensando...",
      fetchReply: true,
    });
    
    const result = await model.generateContent([prompt]);

    try {
        await interaction.editReply({
            content:result.response.text(),
        });
    } catch (error) {
        await interaction.editReply({
            content: "Oops, algo errado aconteceu! Contate o burro(Redraax) para mais detalhes",
        })
    }
    
  },
};
