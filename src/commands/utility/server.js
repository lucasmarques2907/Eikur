const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply({
			content: `Nome do servidor: **${interaction.guild.name}**. Quantidade de membros: **${interaction.guild.memberCount}**.`,
			ephemeral: true
		});
	},
};
