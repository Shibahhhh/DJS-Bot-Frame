const { MessageEmbed } = require("discord.js");
const {normal} = require('../../config/color.json')
module.exports = {
    name: 'test',
    description: `Testing commands`,
    aliases: [],
    userpermissions: [],
    guildOnly: true,
    cooldown: 5,
    devOnly: true,
    async execute(client, message) {
        const embed = new MessageEmbed()
            .setColor(normal)
            .setTitle("Bot is functional")
            .setTimestamp()
        return message.channel.send(embed)
    },
};