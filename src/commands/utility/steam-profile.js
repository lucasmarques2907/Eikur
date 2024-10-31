const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("steam")
    .setDescription("Procure o perfil de alguém na steam")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Digite o id ou o nick da pessoa")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply({
      content: "Pensando...",
      fetchReply: true,
    });

    const id = encodeURIComponent(interaction.options.getString("id"));

    try {
      const response = await fetch(
        `https://api.snaz.in/v2/steam/user-profile/${id}`
      );
      const data = await response.json();

      //   console.log(JSON.stringify(data, null, 2));

      const privateEmbed = new EmbedBuilder()
        .setColor(0x66c0f4)
        .setAuthor({
          name: `${data["username"]}`,
          url: `https://steamcommunity.com/id/${data["custom_url"]}/`,
        })
        .setDescription(`**Perfil privado**`)
        .setThumbnail(data["avatar"])
        .setTimestamp()
        .setFooter({
          text: "Steam",
          iconURL:
            "https://w7.pngwing.com/pngs/707/975/png-transparent-dota-steam-logo-playerunknown-s-battlegrounds-alien-swarm-steam-computer-icons-logo-steam-miscellaneous-purple-game-thumbnail.png",
        });

      if (data["private"]) {
        await interaction.editReply({
          content: "",
          embeds: [privateEmbed],
        });
      } else {
        let bandeira;

        if (data["flag"]) {
          bandeira = `https://flagsapi.com/${data[
            "flag"
          ].toUpperCase()}/flat/64.png`;
        } else {
          bandeira = `https://cdn.imgbin.com/10/25/15/imgbin-computer-icons-n-a-not-M9zN1LmEHF3ptZjmEqsBKFfUb.jpg`;
        }

        // Processar o HTML para Markdown
        let summary = data["summary"]["raw"] || "N/A"; // Define "N/A" se o resumo estiver vazio

        summary = summary
          .replace(/<br\/?>/g, "\n") // Substituir <br> por quebras de linha
          .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g, "[$2]($1)") // Converter links para Markdown
          .replace(/<div class="bb_h1">(.*?)<\/div>/g, "**$1**\n") // Destacar e adicionar quebra de linha para bb_h1
          .replace(
            /<span class="bb_spoiler"><span>(.*?)<\/span><\/span>/g,
            "||$1||"
          ) // Adicionar formatação de spoiler
          .replace(/<span class="bb_link_host">.*?<\/span>/g, "") // Remover conteúdo dentro de <span class="bb_link_host">
          .replace(/<\/?[^>]+(>|$)/g, ""); // Remover qualquer outra tag HTML restante

        const steamEmbed = new EmbedBuilder()
          .setColor(0x66c0f4)
          .setAuthor({
            name: `${data["username"]} (${data["level"]["value"]})`,
            iconURL: bandeira,
            url: `https://steamcommunity.com/id/${data["custom_url"]}/`,
          })
          .setDescription(summary)
          .setThumbnail(data["avatar"])
          .setTimestamp()
          .setImage(data["background_url"])
          .setFooter({
            text: "Steam",
            iconURL:
              "https://w7.pngwing.com/pngs/707/975/png-transparent-dota-steam-logo-playerunknown-s-battlegrounds-alien-swarm-steam-computer-icons-logo-steam-miscellaneous-purple-game-thumbnail.png",
          });

        let achievements;

        if (data["recent_activity"] != null) {
          data["recent_activity"]["games"]
            .slice(0, 3)
            .forEach((game, index) => {
              if (game["name"]) {
                achievements = game["achievement_progress"]
                  ? `${game.achievement_progress.completed.value}/${game.achievement_progress.total.value}`
                  : "N/A";

                steamEmbed.addFields({
                  name: game["name"],
                  value: `**[Link do jogo](${game["url"]})**\nAchievements: **${achievements}**\nTempo de jogo: **${game["hours"]["value"]} horas**\nJogado pela última vez em **${game["last_played"]}**`,
                });
              }
            });
        }

        const banComunidade = data?.bans?.community ? "Sim" : "Não";
        const banJogos =
          data?.bans?.game === "none" ? "Nenhum" : data?.bans?.game;
        const banTrocas = data?.bans?.trade ? "Sim" : "Não";
        let banVac = data?.bans?.vac === "none" ? "Nenhum" : data?.bans?.vac;
        const ultimoBan =
          data?.bans?.days_since_last?.value != null
            ? `${data.bans.days_since_last.value} dias`
            : "Ainda não tomou";

        if (banVac != "Nenhum") {
          const genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          banVac = (
            await model.generateContent([
              `responda apenas o número: transforme ${banVac}" em um inteiro`,
            ])
          ).response.text().trim();
        }

        const jogos = data?.counts?.games?.value ?? "N/A";
        const amigos = data?.counts?.friends?.value ?? "N/A";
        const badges = data?.counts?.badges?.value ?? "N/A";
        const screenshots = data?.counts?.screenshots?.value ?? "N/A";
        const reviews = data?.counts?.reviews?.value ?? "N/A";

        steamEmbed.addFields({
          name: "Outros",
          value: `Jogos: **${jogos}**\nAmigos: **${amigos}**\nInsígnias: **${badges}**\nScreenshots: **${screenshots}**\nReviews: **${reviews}**`,
          inline: true,
        });

        steamEmbed.addFields({
          name: "Ban status",
          value: `Ban na comunidade: **${banComunidade}**\nBan de jogos: **${banJogos}**\nBan de trocas: **${banTrocas}**\nBan VAC: **${banVac}**\nÚltimo ban: **${ultimoBan}**`,
          inline: true,
        });

        await interaction.editReply({
          content: "",
          embeds: [steamEmbed],
        });
      }
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content:
          "Verifique se o id informado está correto e tente novamente\nSe o erro persistir contate o desenvolvedor burro -> <@337484547484549123>\n",
      });
    }
  },
};
