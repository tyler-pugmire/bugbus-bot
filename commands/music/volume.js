const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class VolumeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      aliases: ['set-volume', 'set-vol', 'vol'],
      group: 'music',
      memberName: 'volume',
      description: 'Change the volume',
      format: '[level]',
			details: 'The volume level ranges from 0-10. You may specify "up" or "down" to modify the volume level by 2.',
			examples: ['volume', 'volume 7', 'volume up', 'volume down']
    });
  }

  run(msg, args) {
    const queue = this.queue.get(msg.guild.id);
    if(!queue) {
      msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} there isn't any music playing, oh brilliant one.`
			}});
      return;
    }
    if(!args) {
      msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} the dial is currently set to ${queue.volume}`
			}});
      return;
    }
    if (!queue.voiceChannel.members.has(msg.author.id)) {
      msg.channel.send({embed: {
				color: parseInt(globals.messageColor),
				description: `${msg.author} you're not in the voice channel.`
			}});
			return;
    }
    
    let volume = parseInt(args);
    if(isNaN(volume)) {
      volume = args.toLowerCase();
      if(volume === 'up' || volume === '+') volume = queue.volume + 2;
      else if(volume === 'down' || volume === '-') volume = queue.volume - 2;
      else {
        msg.channel.send({embed: {
          color: parseInt(globals.errorColoer),
          description: `${msg.author} invalid volume level. The dial goes from 0-10.`
        }});
        return;
      }
      if(volume === 11) volume = 10;
    }

    volume = Math.min(Math.max(volume, 0), volume === 11 ? 11 : 10);
		queue.volume = volume;
    if (queue.songs[0].dispatcher) 
      queue.songs[0].dispatcher.setVolumeLogarithmic(queue.volume / 5);
    msg.channel.send({embed: {
      color: parseInt(globals.errorColoer),
      description: `${msg.author} ${volume === 11 ? 'this one goes to 11!' : `set the dial to ${volume}.`}`
    }});
  }

  get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
	}
}

module.exports = VolumeCommand;