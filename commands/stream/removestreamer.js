const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class RemoveStreamerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'removestreamer',
      group: 'stream',
      memberName: 'removestreamer',
      description: 'Removes channel from list of channels to get notifications for.',
      userPermission: "ADMINISTRATOR",
      args: [
        {
          key: 'channel',
          prompt: 'Name of the channel to remove notifications for.',
          type: 'string'
        }
      ]
    });
  }
  
  async run(message, args) {
    var streamers = this.client.provider.get(message.guild.id, "streamers", null);
    if(streamers == null) {
      return;
    }
    if(streamers[args.channel] == null) {
      return;
    }
    delete streamers[args.channel];
    this.client.provider.set(message.guild.id, "streamers", streamers);
    console.log(this.client.provider);
  }
}

module.exports = RemoveStreamerCommand;