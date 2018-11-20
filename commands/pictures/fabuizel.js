const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class FabuizelCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'fabuizel',
      group: 'pictures',
      memberName: 'fabuizel',
      description: "chen's 5 minute masterpiece"
    });
  }



  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/420043635162087446/514375241397567509/fabuizel.png"
      },
      title:"You have been visited by the Fabuizel!  Post a reaction within 30 seconds and get 1 year of no VGC hax." 
    }});
  }
}
module.exports = FabuizelCommand;