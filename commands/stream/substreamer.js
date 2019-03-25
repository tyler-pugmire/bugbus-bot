const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const db = JSON.parse(fs.readFileSync('./storage/db.json', 'utf8')).mainDB;

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
    if(!db.hasOwnProperty(message.guild.id)) {
      console.log("guild not found");
      return;
    }
    var guilddb = db[message.guild.id];
    if(!guilddb.hasOwnProperty("streamers")) {
      console.log("no streams");
      return;
    }
    var streamers = guilddb["streamers"];
    if(streamers[args.channel] == null) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        title: "This streamer is not being followed on this server."
      }})
      return;
    }
    
    

  }
}

module.exports = SubStreamerCommand;