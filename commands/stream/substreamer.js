const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class SubStreamerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'substreamer',
      group: 'stream',
      memberName: 'substreamer',
      description: 'Receive a DM whenever specified channel goes live.',
      args: [
        {
          key: 'channel',
          prompt: 'Name of the channel to get notifications for.',
          type: 'string'
        }
      ]
    });
  }
  
  async run(message, args) {
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
      }})
      return;
    }
    if(streamers[args.channel].subs == null) {
       streamers[args.channel].subs = [];
    }
    streamers[args.channel].subs.push(message.author.id);
    message.channel.send({embed: {
      color: parseInt(globals.successColor),
      title: "You are now subscribed to this streamer."
    }});
  }
}

module.exports = SubStreamerCommand;