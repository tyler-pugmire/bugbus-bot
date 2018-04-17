const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));


//
//checkTwitchStream();

class StreamCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'stream',
      group: 'stream',
      memberName: 'stream',
      description: 'Sets the current channel to the output of stream notifications.',
      userPermission: "ADMINISTRATOR"
    });
  }
  
  async run(message, args) {
    return;
    this.client.provider.set(message.guild.id, "stream_channel", message.channel.id);
    console.log(this.client.provider);
  }
}

module.exports = StreamCommand;