const commando = require('discord.js-commando');
const bot = new commando.Client({
  owner: '94974307192541184',
	commandPrefix: '!'
});
const path = require('path');
const sqlite = require('sqlite');
const request = require('request');
const oneLine = require('common-tags').oneLine;


//const func = require('./functions.js'); // If this returns an error for you (or you might be on ubuntu/linux), try '../functions.js'
//console.log(func);

// Global Settings

bot.on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    console.log(`Bot ready; logged in as ${bot.user.username}#${bot.user.discriminator} (${bot.user.id})`);
  })
  .on('disconnect', () => { console.warn('Disconnected!'); })
  .on('reconnecting', () => { console.warn('Reconnecting...'); })
  .on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

bot.setProvider(
	sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

bot.registry
  .registerGroups([
    ['pictures', 'Picture commands'],
		['util', 'Utility Commands'],
		['minecraft', 'Minecraft Commands'],
		['yugioh', 'Yu-Gi-Oh Commands'],
		['puyo-puyo', 'Puyo-Puyo commands'],
		['stream', 'Stream Commands']
	])
	.registerDefaultTypes()
  .registerCommandsIn(path.join(__dirname, 'commands'));

bot.login(process.env.TOKEN);

const StreamNotification = require('./stream_notification.js');
var streamNotify = new StreamNotification(bot);
setInterval(streamNotify.run.bind(streamNotify), 30 * 1000);

