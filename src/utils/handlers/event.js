const { readdirSync } = require('fs');

module.exports = (client) => {
	let events = readdirSync("./src/events/").filter(x => x.endsWith(".js")).map(x => x.split(".")[0]);
	events.forEach(file => {
		client.on(file, require(`../../events/${file}`).bind(null, client));
		if(client.shard.ids[0] === 0) console.log(`Initialized ${file} Event`);
	});
};