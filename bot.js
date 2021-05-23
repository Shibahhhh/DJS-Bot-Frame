const { Client, Collection } = require("discord.js");
const config = require('./src/config/config.json')
const client = new Client({
  disableEveryone: true
});



client.commands = new Collection();
client.cooldowns = new Collection();

["command",, "event"].forEach(handler => {
  require(`./src/utils/handlers/${handler}`)(client);
});

client.login(config.token)