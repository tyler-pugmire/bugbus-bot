const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class WhoosCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'whoos',
      group: 'pictures',
      memberName: 'whoos',
      description: 'Oh Whoos'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/427000957830692868/427001061585453066/ohwhoos.png"
      } 
    }});
  }
}

module.exports = WhoosCommand;