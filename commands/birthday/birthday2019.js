const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class Birthday2019Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'birthday2019',
      group: 'birthday',
      memberName: 'birthday2019',
      description: 'Jess 2019 birthday gift!'
    });
  }



  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/568622299390148628/574756093125853190/rosa_w2_commission.png"
      } 
    }});
  }
}
module.exports = Birthday2019Command;