const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const FormData = require("form-data");
const fetch = require("node-fetch");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("img")
    .setDescription("Faça upload de uma imagem e escolha um efeito de edição")
    .addAttachmentOption((option) =>
      option
        .setName("imagem")
        .setDescription("Envie uma imagem para upload")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("efeito")
        .setDescription("Escolha um efeito para aplicar à imagem")
        .setRequired(true)
        .addChoices(
          { name: "Billboard", value: "billboard" },
          { name: "Boil", value: "boil" },
          { name: "Bomb", value: "bomb" },
          { name: "Bonks", value: "bonks" },
          { name: "Canny", value: "canny" },
          { name: "Contour", value: "contour" },
          { name: "Cow", value: "cow" },
          { name: "Cube", value: "cube" },
          { name: "Earthquake", value: "earthquake" },
          { name: "Explicit", value: "explicit" },
          { name: "Flag", value: "flag" },
          { name: "Flush", value: "flush" },
          { name: "Globe", value: "globe" },
          { name: "Glitch", value: "glitch" },
          { name: "Hearts", value: "hearts" },
          { name: "Kanye", value: "kanye" },
          { name: "Lsd", value: "lsd" },
          { name: "Neon", value: "neon" },
          { name: "Patpat", value: "patpat" },
          { name: "Print", value: "print" },
          { name: "Pyramid", value: "pyramid" },
          { name: "Rain", value: "rain" },
          { name: "Shoot", value: "shoot" },
          { name: "Warp", value: "warp" }
        )
    ),
  async execute(interaction) {
    await interaction.reply({
      content: "Enviando imagem...",
      fetchReply: true,
    });

    const imageAttachment = interaction.options.getAttachment("imagem");
    const selectedEffect = interaction.options.getString("efeito");

    if (!imageAttachment || !imageAttachment.contentType.startsWith("image/")) {
      await interaction.editReply({
        content: "Por favor, envie uma imagem válida.",
      });
      return;
    }

    const uploadUrl = "https://api.jeyy.xyz/v2/general/image_upload";
    const token = process.env.JEYY_API;

    try {
      const form = new FormData();
      const imageResponse = await fetch(imageAttachment.url);
      const imageBuffer = await imageResponse.buffer();
      form.append("image", imageBuffer, {
        filename: "upload.png",
        contentType: imageAttachment.contentType,
      });

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          ...form.getHeaders(),
        },
        body: form,
      });

      if (!uploadResponse.ok) {
        throw new Error(
          `Erro ao enviar a imagem: ${uploadResponse.statusText}`
        );
      }

      const temporaryUrl = await uploadResponse.text();

      // Faz a requisição GET para o endpoint com a URL temporária e o efeito selecionado
      const getUrl = `https://api.jeyy.xyz/v2/image/${selectedEffect}?image_url=${encodeURIComponent(
        temporaryUrl
      )}`;
      const getResponse = await fetch(getUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!getResponse.ok) {
        throw new Error(
          `Erro ao processar a imagem: ${getResponse.statusText}`
        );
      }

      // Obtém o tipo de conteúdo da resposta
      //   const contentType = getResponse.headers.get("content-type");
      const imageBufferResponse = await getResponse.buffer();

      // Define a extensão do arquivo com base no tipo de conteúdo
      //const extension = contentType.includes("gif") ? "gif" : "png";

      console.log(temporaryUrl);

      await interaction.editReply({
        content: "Aqui está sua imagem editada:",
        files: [
          {
            //${extension}
            name: `imagem_editada.gif`,
            attachment: imageBufferResponse,
          },
        ],
      });
    } catch (error) {
      await interaction.editReply({
        content: `Erro ao processar a imagem: ${error.message}`,
      });
    }
  },
};
