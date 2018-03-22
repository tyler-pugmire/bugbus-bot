const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class AbsolutelyBarbaricCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'absolutelybarbaric',
      group: 'pictures',
      memberName: 'absolutelybarbaric',
      description: 'Absolutely Barbaric!'
    });
  }



  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/421143753319776276/425849577795747845/a14.png"
      } 
    }});
  }
}
module.exports = AbsolutelyBarbaricCommand;