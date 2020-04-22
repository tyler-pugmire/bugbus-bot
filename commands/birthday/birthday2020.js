const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class Birthday2020Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'birthday2020',
      group: 'birthday',
      memberName: 'birthday2020',
      description: 'Jess 2020 birthday gift!'
    });
  }



  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/414626170441564173/702372993342373908/jess_bday_6_4k.png"
      } 
    }});
  }
}
module.exports = Birthday2020Command;