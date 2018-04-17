const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class AddStreamerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'addstreamer',
      group: 'stream',
      memberName: 'addstreamer',
      description: 'Adds channel to list of channels to get notifications for.',
      userPermission: "ADMINISTRATOR",
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
    return;
    var streamers = this.client.provider.get(message.guild.id, "streamers", null);
    if(streamers == null) {
      streamers = {};
    }
    if(streamers[args.channel] == null) {
      streamers[args.channel] = {};
      streamers[args.channel].online = false;
      streamers[args.channel].prevonline = false;
      console.log(streamers);
      this.client.provider.set(message.guild.id, "streamers", streamers);
      console.log(this.client.provider);
    }
  }
}

module.exports = AddStreamerCommand;