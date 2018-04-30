const { Command } = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			group: 'music',
			memberName: 'resume',
			description: 'Resumes the currently playing song.',
			details: 'Only moderators may use this command.'
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
				description: `${msg.author} pretty sure a song that hasn\'t actually begun playing yet could be considered "resumed".`
			}});
			return;
		}
		if (queue.songs[0].playing) {
			msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} Resuming a song that isn\'t paused is a great move. Really fantastic.`
			}});
			return;
		}
		queue.songs[0].dispatcher.resume();
		queue.songs[0].playing = true;

		msg.channel.send({embed: {
			color: parseInt(globals.messageColor),
			description: `${msg.author} resumed the music. This party ain\'t over yet!`
		}});
	}

	get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
	}
};

module.exports = ResumeCommand;