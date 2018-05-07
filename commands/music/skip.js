const commando = require('discord.js-commando');
const { oneLine } = require('common-tags');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class SkipCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'skip',
			group: 'music',
			memberName: 'skip',
			description: 'Skips the song that is currently playing.',
			details: oneLine`
				If there are 3 people or fewer (excluding the bot) in the voice channel, the skip will be immediate.
				With at least 4 people, a voteskip will be started with 15 seconds to accept votes.
				The required votes to successfully skip the song is one-third of the number of listeners, rounded up.
				Each vote will add 5 seconds to the vote's timer.
				Moderators can use the "force" parameter, which will immediately skip without a vote, no matter what.
			`
    });
  }

  run(msg, args) {
    const queue = this.queue.get(msg.guild.id);
    if (!queue) { 
			msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} there isn't any music playing, oh brilliant one.`
			}});
			return;
		}
    if (!queue.voiceChannel.members.has(msg.author.id)) {
			msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} 'you\'re not in the voice channel. You better not be trying to mess with their mojo, man.`
			}});
			return;
		}
    if (!queue.songs[0].dispatcher) { 
			msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} 'the song hasn\'t even begun playing yet. Why not give it a chance?`
			}});
			return; // eslint-disable-line max-len
		}
    
		msg.channel.send({embed: {
			color: parseInt(globals.messageColor),
			description: this.skip(msg.guild, queue)
		}});
  }

  skip(guild, queue) {
		const song = queue.songs[0];
		song.dispatcher.end();

		return `Skipped: **${song}**`;
	}

	get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
	}
}

module.exports = SkipCommand;