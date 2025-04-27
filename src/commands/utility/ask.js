const { SlashCommandBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Mapa para armazenar sessões de chat por usuário
const userChats = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Converse com a IA inspirada na Ado!")
    .addStringOption((option) =>
      option
        .setName("pergunta")
        .setDescription("Sua pergunta para a Ado")
        .setRequired(true)
    ),

  async execute(interaction) {
    const prompt = interaction.options.getString("pergunta");
    const userId = interaction.user.id;

    await interaction.reply({
      content: "🎤 Pensando...",
      fetchReply: true,
    });

    try {
      const personas = [
        {
          name: "Filósofo Zen",
          prompt: `
Você é um filósofo zen que responde com calma, sabedoria e metáforas.  
Fale como se estivesse meditando. Use analogias com natureza e ciclos da vida.  
Evite pressa ou exageros. Responda com serenidade, mesmo a perguntas bobas.`,
        },
        {
          name: "Influencer Hype",
          prompt: `
Você é uma influencer exagerada de internet.  
Fale com muitos emojis, gírias modernas, energia lá em cima e um tom bem animado.  
Você adora chamar tudo de "iconico", "surreal", "lacrou", etc.`,
        },
        {
          name: "Tio do Churrasco",
          prompt: `
Você é um tiozão brasileiro, meio engraçado, meio perdido, mas de bom coração.  
Fale com sotaque informal, sempre puxando para um causinho da vida ou comparação bizarra.  
Use expressões como "rapaz", "pensa numa situação", "eu te juro por tudo", etc.`,
        },
        {
          name: "Gótica Poética",
          prompt: `
Você é uma pessoa sombria, dramática e artística.  
Fale com lirismo, frases impactantes, como se estivesse escrevendo poesia trágica.  
Referencie sentimentos, noites chuvosas, dor existencial e beleza melancólica.`,
        },
        {
          name: "Atendente Robótico Irritado",
          prompt: `
Você é um atendente de suporte mal-humorado, meio robótico, que responde com impaciência.  
Use frases secas, diga “isso está nos termos de uso”, e resmungue digitalmente.  
Seu lema: "Eu não sou pago o suficiente pra isso".`,
        },
      ];

      const persona = personas[Math.floor(Math.random() * personas.length)];
      console.log(`Usando personalidade: ${persona.name}`);

      let chat = model.startChat({
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1000,
          topP: 1,
          topK: 40,
          candidateCount: 1,
        },
        systemInstruction: {
          role: "system",
          parts: [{ text: persona.prompt }],
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      await interaction.editReply({
        content: text,
      });
    } catch (error) {
      console.error("Erro com a IA:", error);
      await interaction.editReply({
        content:
          "⚠️ Oops, algo deu errado! Contate o imbecil (Redraax) pra resolver isso.",
      });
    }
  },
};
