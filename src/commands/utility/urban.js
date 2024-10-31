const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("urban")
    .setDescription("Procure o significado de um termo no Urban Dictionary")
    .addStringOption((option) =>
      option
        .setName("termo")
        .setDescription("Termo que será pesquisado")
        .setRequired(true)
    ),
  async execute(interaction) {
   await interaction.reply({
      content: "Pensando...",
      fetchReply: true,
    });

    const termo = interaction.options.getString("termo");

    try {
        // Fazendo a requisição para a API do Urban Dictionary
        const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${termo}`);
        const data = await response.json();
  
        if (!data.list || data.list.length === 0) {
          return interaction.editReply({
            content: `Nenhum resultado encontrado para o termo: **${termo}**`,
          });
        }
        
        // Ordenando os resultados por thumbs_up em ordem decrescente e pegando os 3 primeiros
        const resultados = data.list
        .sort((a, b) => b.thumbs_up - a.thumbs_up)
        .slice(0, 3);
        
        const urbanEmbed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(`Urban Dictionary - **${termo}**`)
          .setURL(`https://www.urbandictionary.com/define.php?term=${encodeURIComponent(termo)}`)
          .setTimestamp()
          .setFooter({ text: "Urban Dictionary", iconURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXxvba_UpwdAjK1WTkgbz8gda2toDqTPOgOQ&s" });
  
          const MAX_LENGTH = 500; // Limite de caracteres do Discord

          // Função para truncar texto se ultrapassar o limite
          function truncateText(text) {
            if (text.length > MAX_LENGTH) {
              return text.slice(0, MAX_LENGTH - 3) + '...'; // Corta e adiciona '...'
            }
            return text;
          }

        // Adicionando as definições ao embed
        resultados.forEach((entry, index) => {
          urbanEmbed.addFields(
            { name: `Definição ${index + 1}`, value: truncateText(entry.definition) },
            { name: "Exemplo", value: truncateText(entry.example || "Sem exemplo disponível") },
            { name: `👍 ${entry.thumbs_up.toString()}`, value: ' ', inline: true },
            { name: `👎 ${entry.thumbs_down.toString()}`, value: ' ', inline: true },
            { name: "\u200B", value: "\u200B" } // Separador
          );
        });
  
        await interaction.editReply({
          content: "",
          embeds: [urbanEmbed],
        });
      } catch (error) {
        console.error("Erro ao buscar dados na API:", error);
        await interaction.editReply({
          content: "Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.",
        });
      }
    },
  };