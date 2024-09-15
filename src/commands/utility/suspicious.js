const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("sus")
    .setDescription("Gera uma cor suspeita aleatória"),
    async execute(interaction) {

          let susColor = Math.floor(Math.random() * 16777215);
        
          let susColorHex = susColor.toString(16).toUpperCase();
          susColorHex = `#${susColorHex.padStart(6, '0')}`

        const exampleEmbed = new EmbedBuilder()
        .setColor(susColor)
        .setTitle(`COR SUSPEITA: ${susColorHex}`)
        .setDescription('Cor suspeita gerada aleatoriamente!')
        .setThumbnail('https://i.imgur.com/fMxwtHH.jpeg')
        await interaction.reply({
            embeds: [exampleEmbed]
        })
    }
}