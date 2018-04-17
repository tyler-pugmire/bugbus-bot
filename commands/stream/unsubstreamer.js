const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class UnsubStreamerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'unsubstreamer',
      group: 'stream',
      memberName: 'unsubstreamer',
      description: 'Stop receiving a DM whenever specified channel goes live.',
      args: [
        {
          key: 'channel',
          prompt: 'Name of the channel to unsub from.',
          type: 'string'
        }
      ]
    });
  }
  
  async run(message, args) {
    return;
    var streamers = this.client.provider.get(message.guild.id, "streamers", null);
    if(streamers == null) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        title: "No streamers have been followed on this server."
      }})
      return;
    }
    if(streamers[args.channel] == null) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        title: "This streamer is not being followed on this server."
      }});
      return;
    }
    if(streamers[args.channel].subs == null) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        title: "You are not subscribed to this streamer."
      }});
      return;
    }
    var index = streamers[args.channel].subs.indexOf(message.author.id);
    if(index !== -1) {
      streamers[args.channel].subs.splice(index, 1);
      message.channel.send({embed: {
        color: parseInt(globals.successColor),
        title: "You are no longer subscribed to this streamer."
      }});
    }
    else {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        title: "You are not subscribed to this streamer."
      }});
    }
  }
}

module.exports = UnsubStreamerCommand;