const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class SubsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'subs',
      group: 'stream',
      memberName: 'subs',
      description: 'Receive a DM with the list of channels you are subscribed to.'
    });
  }
  
  async run(message, args) {
    var streamers = this.client.provider.get(message.guild.id, "streamers", null);
    if(streamers == null) {
      return;
    }
    let keys = Object.keys(streamers);
    let list = [];
    for(var i = 0; i < keys.length; ++i) {
      let stream = streamers[keys[i]];
      if(stream.subs) {
        let index = stream.subs.indexOf(message.author.id);
        if(index !== -1)
          list.push(keys[i]);
      }
    }
    message.author.send("__**Subs:**__\n" + list.join("\n"));
    message.channel.send({embed: {
      color: parseInt(globals.messageColor),
      title: "Check your DMs for list of streamers you're subscribed to!"
    }});
  }
}

module.exports = SubsCommand;