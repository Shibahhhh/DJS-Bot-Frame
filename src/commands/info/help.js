const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const emojis = require('../../config/emojis.json')
const color = require('../../config/color.json')
const {stripIndent } = require("common-tags");

module.exports = {
	name: 'help',
	description: `Displays a list of all current commands, sorted by category. Can be used in conjunction with a command for additional information.`,
	aliases: [],
	usage: "help [command]",
	userpermissions: [],
	guildOnly: true,
	args: true,
	cooldown: 5,
	async execute(client, message, args, prefix) {
		const roleColor = color.normal

		if (!args[0]) {
			let categories = [];
			const ignorechategories = ['owner']
			readdirSync("./src/commands/").forEach((dir) => {
				if (ignorechategories.includes(dir)) return;
				const commands = readdirSync(`./src/commands/${dir}/`).filter((file) =>
					file.endsWith(".js")
				);

				const cmds = commands.filter((command) => {
					let file = require(`../../commands/${dir}/${command}`);
					return !file.hidden;
				}).map((command) => {
					let file = require(`../../commands/${dir}/${command}`);

					if (!file.name) return "No command name.";

					let name = file.name.replace(".js", "");

					return `\`${name}\``;
				});

				let data = new Object();

				data = {
					name: dir.toUpperCase(),
					value: cmds.length === 0 ? "No Commands found" : cmds.join(" "),
				};

				categories.push(data);
			});

			const embed = new MessageEmbed()
				.setTitle("Bot's Commands")
				.addFields(categories)
				.setDescription(
					stripIndent`**Prefix:** \`${prefix}\`
					**More Information:** \`${prefix}help [command]\``
				)
				.setFooter(
					message.member.displayName,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp()
				.setColor(roleColor);
			return message.channel.send(embed);
		} else {
			const command =
				client.commands.get(args[0].toLowerCase()) ||
				client.commands.find(
					(c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
				);

			if (!command) {
				const embed = new MessageEmbed()
					.setTitle(` ${emojis.fail} Unable to find command, please check command list`)
					.setColor(color.error);
				return message.channel.send(embed);
			}

			const embed = new MessageEmbed()
				.setTitle(`Command \`${command.name}\``)
				.setDescription(
					`**Description** ${command.description ? command.description : "No description for this command."}`
				)
				.addField(
					"Aliases:",
					command.aliases
						? `\`${command.aliases.join("` `")}\``
						: "No aliases for this command.", true
				)
				.addField(
					"Usage",
					command.usage
						? `\`${prefix}${command.usage}\``
						: `\`${prefix}${command.name}\``, true
				)
				.addField(
					"Cooldown",
					`\`${command.cooldown || 1} second(s)\``

				)
				.setFooter(
					message.member.displayName,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp()
				.setColor(roleColor);
			return message.channel.send(embed);
		}

	},
};