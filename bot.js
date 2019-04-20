const commando = require('discord.js-commando');
const bugbusClient = require('./structures/bugbusclient.js')
const bot = new bugbusClient({
  owner: '94974307192541184',
	commandPrefix: '!'
});
const path = require('path');
const sqlite = require('sqlite');
const request = require('request');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');
const colors = JSON.parse(fs.readFileSync('./storage/colors.json', 'utf8')).Colors;
const db = JSON.parse(fs.readFileSync('./storage/db.json', 'utf8')).mainDB;
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

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
	})
	.on('guildCreate', (guild) => {
		let curColors = guild.roles.filter(role => role.name.startsWith("$")).map(c => c.name.slice(1));
		let colorDiff = colors.filter(x => !curColors.includes(x.name));
		for(var i = 0; i < colorDiff.length; ++i) {
			guild.createRole({
				name: `$${colorDiff[i].name}`,
				color: colorDiff[i].value,
				permissions: []
		 });
		}
	})
	.on('guildMemberAdd', (member) => {

		if(member.id == 310968544005324801) { //chen has joined the server
			let worst_pleb = member.guild.roles.find("name", "Worst Pleb");
			if(worst_pleb != null) {
				member.addRole(worst_pleb);
			}
		}
		else if(member.guild.id == "482425662251073537") {
			let mafia = member.guild.roles.find("name", "Mafia");
			let night = member.guild.roles.find("name", "Night");
			if(mafia != null && night != null) {
				member.addRole(mafia);
				member.addRole(night);
			}
		}
		else {
			let pleb = member.guild.roles.find("name", "pleb");
			let mini_mod = member.guild.roles.find("name", "mini mod");
			var flip = Math.floor(Math.random()*2) + 1;
			member.addRole(flip == 1 ? pleb : mini_mod);
		}
	})


	.on('message',  message => {
		var grook = 'grookey'
		if (message.content.toLowerCase().includes(grook)) {
			message.channel.send({embed: {
				color : parseInt(globals.messageColor),
				image: {
					url: "https://cdn.discordapp.com/attachments/524387709452550145/552731373937623041/image0.jpg"
				} 	
			}});
		}
	});



//bot.setProvider(
//	sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new commando.SQLiteProvider(db))
//).catch(console.error);

bot.registry
  .registerGroups([
    ['pictures', 'Picture commands'],
		['util', 'Utility Commands'],
		['minecraft', 'Minecraft Commands'],
		//['yugioh', 'Yu-Gi-Oh Commands'],
		['puyo-puyo', 'Puyo-Puyo commands'],
		['stream', 'Stream Commands'],
		['media', 'Media Commands'],
		['music', 'Music Commands'],
	])
	.registerDefaultTypes()
  .registerCommandsIn(path.join(__dirname, 'commands'));

bot.login(process.env.TOKEN);

const StreamNotification = require('./structures/stream_notification.js');
var streamNotify = new StreamNotification(bot);
setInterval(streamNotify.run.bind(streamNotify), 30 * 1000);

var currentDate = new Date();
var date = currentDate.getDate();

class Birthday {
	constructor(client) {
		this.client = client;
		this.messageSent = false;
	}
	
	async checkBirthday(){
	date = currentDate.getDate()
	var channel = this.client.channels.get("414626170441564173")
	if(channel == null) {
		return;
	}
	if (this.messageSent == false) {
		this.messageSent = true;
		channel.send({embed:{
		color: parseInt(globals.messageColor),
		title: "Happy Birthday Jess!",
		description: '<@371436326345506817>',
		fields : [
			{
				name : "Here's something we made for you!",
				value : 'https://docs.google.com/document/d/1mskamW3DFajLeGZb9pwakHc36mU662m3qpV-4WCUuhM/edit?usp=sharing'
			}
		],
		thumbnail: {
			url: "https://cdn.discordapp.com/attachments/415242023931740173/569004090420494356/bugbus_new_years.png"
		}
	}});	
}}};
var bdayNotify = new Birthday(bot);
setInterval(bdayNotify.checkBirthday.bind(bdayNotify), 360);