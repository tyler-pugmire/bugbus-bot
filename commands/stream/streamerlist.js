const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const RichEmbed = require('discord.js').RichEmbed;


class StreamerListCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'streamerlist',
      group: 'util',
      memberName: 'streamerlist',
      description: 'displays the list of streamers this server receives notifications for',
    });
  }
  async run(message, args){
      var streamers = this.client.provider.get(message.guild.id, "streamers", null);
      if(streamers == null) 
        return;
      let keys = Object.keys(streamers);
      message.author.sendMessage("__**Streamers:**__ \n"+keys.join("\n"));
      message.channel.send({embed: {
        color: parseInt(globals.messageColor),
        title: "Check your DMs for list of streamers!"
      }});
  }
}
module.exports = StreamerListCommand