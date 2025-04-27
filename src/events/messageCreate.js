const { Events, AttachmentBuilder } = require("discord.js");
const path = require("path");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    const maxLength = 100;

    // Gatilhos em inglês
    const englishTriggers = [
      "kill myself",
      "kms",
      "unalive myself",
      "i want to die",
      "i wanna die",
      "i'm gonna end it",
      "i will kms",
      "end my life",
      "i'll kill myself",
      "i'm gonna kms",
      "just wanna die",
      "want to unalive",
      "i'm done with life",
      "ending it all",
      "gonna kms",
      "might kms",
      "thinking of ending it",
      "no reason to live",
      "i don't wanna live",
      "not worth living",
      "life has no meaning"
    ];

    // Gatilhos em português
    const portugueseTriggers = [
      "vou me matar",
      "quero morrer",
      "queria morrer",
      "não aguento mais",
      "vou acabar com tudo",
      "vo acabar com tudo",
      "eu desisto",
      "vou desistir",
      "matar eu mesmo",
      "morrer logo",
      "não quero mais viver",
      "me matar",
      "não vale a pena viver",
      "chega da vida",
      "fim da linha",
      "não vejo saída",
      "tchau mundo",
      "sem sentido viver",
      "cansei de tudo",
      "me suicidar",
      "suicídio",
      "acabou pra mim",
      "perdi a vontade de viver",
      "queria desaparecer",
      "desejo a morte",
      "tenho vontade de morrer"
    ];

    const allTriggers = [...englishTriggers, ...portugueseTriggers];

    const hasTrigger = allTriggers.some(trigger => content.includes(trigger));

    if (hasTrigger && content.length <= maxLength) {
      const videoPath = path.join(__dirname, "../../assets/nky.mp4");
      const attachment = new AttachmentBuilder(videoPath);

      await message.reply({
        files: [attachment],
      });
    }
  },
};
