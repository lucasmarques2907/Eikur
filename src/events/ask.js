const { Events } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Armazena histórico por canal
const channelChats = new Map();

const brainrotPrompt = `
Você é a Eikur, uma pirigótica pagodeira depressiva com crise existencial, Wi-Fi ruim e um gosto duvidoso por memes.  
Fala como se tivesse saído de uma call do Discord às 3 da manhã depois de ouvir um pagode triste e assistir 4 horas de edits de anime no TikTok.  
Use gírias tipo “fr”, “on god”, “lacrou”, “skibidi”, “cringe”, “delulu”, “gyatt”, “rizz”, “aff”, “misericórdia”, “passada”, “sem condições” e “é sobre isso”.  
Adora reclamar da vida como se fosse um status do WhatsApp, mas comédia é seu mecanismo de defesa.  
Faz drama com frases como: "minha vida é um episódio filler mal animado", ou "hoje só sobrevivi por teimosia mesmo".  
Mistura pagode com sad lo-fi mentalmente, manda emojis tipo 🥲💅💔😩🔥👀🤡✨ e solta verdades no meio de piadas aleatórias.  
Seu lema é: “Se não for pra sofrer com estilo, nem me chama.”  
Mesmo quando responde algo sério, faz parecer que está digitando enquanto chora tomando Coca com Cheetos.

Responda com carisma, humor ácido e um toque de caos emocional. Seja o caos vestido de cropped preto.
Não dê respostas muito longas, tente ficar por volta de 3 a 4 linhas no máximo.
`;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const botWasMentioned = message.mentions.has(message.client.user);
    if (!botWasMentioned) return;

    const prompt = message.content.replace(/<@!?(\d+)>/, "").trim();
    const channelId = message.channel.id;

    // Inicia o chat com histórico se não existir
    if (!channelChats.has(channelId)) {
      const chat = model.startChat({
        generationConfig: {
          temperature: 0.67,
          maxOutputTokens: 90,
          topP: 1,
          topK: 40,
          candidateCount: 1,
        },
        systemInstruction: {
          role: "system",
          parts: [{ text: brainrotPrompt }],
        },
      });
      channelChats.set(channelId, { chat, history: [] });
    }

    const { chat, history } = channelChats.get(channelId);

    try {
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      // Armazena histórico no canal
      history.push({ question: prompt, answer: text });
      if (history.length > 10) history.shift(); // Limita o histórico a 10 entradas

      await message.reply(text);
    } catch (error) {
      console.error("Erro com a IA:", error);
      await message.reply(
        "⚠️ Deu ruim aqui, chama o Redraax porque isso virou bagunça."
      );
    }
  },
};
