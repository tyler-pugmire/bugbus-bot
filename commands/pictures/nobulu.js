const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class NoBuluCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'nobulu',
      group: 'pictures',
      memberName: 'nobulu',
      description: 'Pls no Bulu!'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/414626170441564173/416836490585178112/Snapchat-453895809.jpg"
      } 
    }});
  }
}

module.exports = NoBuluCommand;