const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const axios = require("axios");
//api key: f0ee0f5c122a494490543124241509
module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Informa o clima na cidade informada")
    .addStringOption((option) =>
      option
        .setName("local")
        .setDescription("Local escolhido para checar a previsão do tempo")
        .setRequired(true)
    ),
  async execute(interaction) {
    const input = interaction.options.getString("local");
    
    try{
        let resp = await axios.get(`http://api.weatherapi.com/v1/current.json?key=f0ee0f5c122a494490543124241509&q=${input}&aqi=no`);
        let result = resp.data;
        interaction.reply({
            content: `Local: ${result.location.name}\nTemperatura atual: ${result.current.temp_c}C\nSensação térmica: ${result.current.feelslike_c}C\nHumidade: ${result.current.humidity}%
            `
        })
    }catch (error){
        interaction.reply({
            content: "Previsão do tempo não encontrada para o local informado."
        })

    }
  },
};
