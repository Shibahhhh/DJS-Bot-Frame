const { ShardingManager } = require('discord.js');
const path = require('path');
const config = require('./src/config/config.json')
const manager = new ShardingManager(path.join(__dirname, 'bot.js'), { 
    totalShards: config.shards,
    token: config.token 
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn().catch(console.error);