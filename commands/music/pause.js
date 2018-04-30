const { Command } = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			aliases: ['shh', 'shhh', 'shhhh', 'shhhhh'],
			group: 'music',
			memberName: 'pause',
			description: 'Pauses the currently playing song.'
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES');
	}

	run(msg) {
		const queue = this.queue.get(msg.guild.id);
		if (!queue) {
			msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} there isn't any music playing to pause, oh brilliant one.`
			}});
			return;
		}
		if (!queue.songs[0].dispatcher) {
			msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} I can\'t pause a song that hasn\'t even begun playing yet.`
			}});
			return;
		}
		if (!queue.songs[0].playing) {
			msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} pausing a song that is already paused is a bad move.`
			}});
			return;
		}
		queue.songs[0].dispatcher.pause();
		queue.songs[0].playing = false;
		msg.channel.send({embed: {
			color: parseInt(globals.messageColor),
			description: `${msg.author} paused the music. Use \`${this.client.commandPrefix}resume\` to continue playing.`
		}});
		return;
	}

	get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
	}
};

module.exports = PauseCommand;