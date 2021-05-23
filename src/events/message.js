const config = require('../config/config.json')
const { error } = require('../config/color.json')
const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js");
const { fail, timer } = require("../config/emojis.json");

module.exports = async function (client, message) {
	const prefix = config.prefix

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		const embed = new MessageEmbed()
			.setAuthor(
				`${message.author.tag}`,
				message.author.displayAvatarURL({ dynamic: true })
			)
			.setTitle(`${fail} Guild only command`)
			.setTimestamp()
			.setColor(error);
		return message.channel.send(embed)
	}
	const validPermissions = [
		"CREATE_INSTANT_INVITE",
		"KICK_MEMBERS",
		"BAN_MEMBERS",
		"ADMINISTRATOR",
		"MANAGE_CHANNELS",
		"MANAGE_GUILD",
		"ADD_REACTIONS",
		"VIEW_AUDIT_LOG",
		"PRIORITY_SPEAKER",
		"STREAM",
		"VIEW_CHANNEL",
		"SEND_MESSAGES",
		"SEND_TTS_MESSAGES",
		"MANAGE_MESSAGES",
		"EMBED_LINKS",
		"ATTACH_FILES",
		"READ_MESSAGE_HISTORY",
		"MENTION_EVERYONE",
		"USE_EXTERNAL_EMOJIS",
		"VIEW_GUILD_INSIGHTS",
		"CONNECT",
		"SPEAK",
		"MUTE_MEMBERS",
		"DEAFEN_MEMBERS",
		"MOVE_MEMBERS",
		"USE_VAD",
		"CHANGE_NICKNAME",
		"MANAGE_NICKNAMES",
		"MANAGE_ROLES",
		"MANAGE_WEBHOOKS",
		"MANAGE_EMOJIS",
	]
	if (command.userpermissions.length) {
		let invalidPerms = []
		for (const perm of command.userpermissions) {
			if (!validPermissions.includes(perm)) {
				return
			}
			if (!message.member.hasPermission(perm)) {
				invalidPerms.push(perm);
			}
		}
		if (invalidPerms.length) {
			if (config.owner) {
				console.log('Owner did command')
			} else {
				const embed = new MessageEmbed()
					.setAuthor(
						`${message.author.tag}`,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${fail} Missing User Permissions`)
					.setDescription(`\`${invalidPerms}\``)
					.setTimestamp()
					.setColor(error);
				message.channel.send(embed);
				return
			}

		}
	}


	if (command.args && !args.length) {

	}

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;

	if (timestamps.has(message.author.id)) {
		if (config.owner == message.author.id) {
			console.log('Owner did command')
		} else {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				const embed = new MessageEmbed()
					.setAuthor(
						`${message.author.tag}`,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${fail} Cooldown`)
					.setDescription(`${timer} **Please wait ${timeLeft.toFixed(1)} more seconds before using \`${command.name}\`**`)
					.setTimestamp()
					.setColor(error);
				message.channel.send(embed);
				return
			}
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	if (command.devOnly == true && message.author.id !== config.owner) return
	try {
		command.execute(client, message, args, prefix);
	} catch (error) {
		console.error(error);
		const embed = new MessageEmbed()
			.setAuthor(
				`${message.author.tag}`,
				message.author.displayAvatarURL({ dynamic: true })
			)
			.setTitle(`${fail} Error`)
			.setDescription(`An error occured`)
			.setTimestamp()
			.setColor(error);
		message.channel.send(embed);
		return
	}
};