const { MessageEmbed } = require("discord.js");
const color = require('../../config/color.json')
module.exports = {
  name: 'ping',
  description: `Gets bot's current latency and API latency.`,
  aliases: [],
  userpermissions: [],
  guildOnly: true,
  cooldown: 5,
  async execute(client, message) {
    const embed = new MessageEmbed()
      .setDescription("`Pinging...`")
      .setColor(color.normal);
    const msg = await message.channel.send(embed);
    const timestamp = message.editedTimestamp
      ? message.editedTimestamp
      : message.createdTimestamp; // Check if edited
    const latency = `\`${Math.floor(msg.createdTimestamp - timestamp)}ms\``;
    const apiLatency = `\`${Math.round(message.client.ws.ping)}ms\``;

    const ping = new MessageEmbed()
      .setTitle(`Pong!`)
      .addField("Latency", latency, true)
      .addField("API Latency", apiLatency, true)
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor(color.normal)
      .setTimestamp();
    msg.edit(ping);

  },
};