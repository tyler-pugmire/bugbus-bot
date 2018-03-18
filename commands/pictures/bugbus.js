const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class BugBusCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'bugbus',
      group: 'pictures',
      memberName: 'bugbus',
      description: 'BUGBUS!'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/414626170441564173/414649261314277386/Snapchat-931093747.jpg"
      } 
    }});
  }
}

module.exports = BugBusCommand;