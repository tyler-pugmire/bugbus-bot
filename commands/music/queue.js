const commando = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');
const Song = require('../../structures/song');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class QueueCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      group: 'music',
      memberName: 'queue',
      description: 'View the current queue of songs',
      args: [
				{
					key: 'page',
					prompt: 'What page would oyu like to view?\n',
					type: 'integer',
          default: 1
				}
			]
    });
  }

  run(msg, {page}) {
    const queue = this.queue.get(msg.guild.id);
    if(!queue) {
      msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} there isn't any music playing to pause, oh brilliant one.`
      }});
      return;
    }

    const paginated = commando.util.paginate(queue.songs, page);
    const totalLength = queue.songs.reduce((prev, song) => prev + song.length, 0);
    const currentSong = queue.songs[0];
    const currentTime = currentSong.dispatcher ? currentSong.dispatcher.time / 1000 : 0;

    msg.channel.send({embed : {
      color: parseInt(globals.messageColor),
      description: stripIndents`
				__**Song queue, page ${paginated.page}**__
				${paginated.items.map(song => `**-** ${!isNaN(song.id) ? `${song.name} (${song.lengthString})` : `[${song.name}](${`https://www.youtube.com/watch?v=${song.id}`})`} (${song.lengthString})`).join('\n')}
				${paginated.maxPage > 1 ? `\nUse ${msg.usage()} to view a specific page.\n` : ''}
				**Now playing:** ${!isNaN(currentSong.id) ? `${currentSong.name}` : `[${currentSong.name}](${`https://www.youtube.com/watch?v=${currentSong.id}`})`}
				${oneLine`
					**Progress:**
					${!currentSong.playing ? 'Paused: ' : ''}${Song.timeString(currentTime)} /
					${currentSong.lengthString}
					(${currentSong.timeLeft(currentTime)} left)
				`}
				**Total queue time:** ${Song.timeString(totalLength)}`
    }});
  }

  get queue() {
    if (!this._queue) 
      this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
	}
}

module.exports = QueueCommand;