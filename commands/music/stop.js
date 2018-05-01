const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class StopMusicCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      group: 'music',
      memberName: 'stop',
      description: 'Stops the music and wipes the queue.',
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
		const song = queue.songs[0];
		queue.songs = [];
    if (song.dispatcher) 
      song.dispatcher.end();

    msg.channel.send({embed: {
			color: parseInt(globals.messageColor),
			description: `${msg.author} you\'ve just killed the party. Congrats. 👏`
		}});
	}

	get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
	}
}

module.exports = StopMusicCommand;