const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
class EssCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'ess',
      group: 'puyo-puyo',
      memberName: 'ess',
      description: 'best puyo pics'
    });
  }

  async run(message, args) {
      var flip = Math.floor(Math.random()*2) +1 ;
      if (flip == 1) {
          message.channel.send({embed: {
  color: parseInt(globals.messageColor),
  image:{
      url: "https://cdn.discordapp.com/attachments/426999734008283136/499006394855456768/images.jpeg"
  },
  title: "When Jess calls you worst girl."
}}); 
      } else {
        message.channel.send({embed: {
            color: parseInt(globals.messageColor),
            image:{
                url:"https://cdn.discordapp.com/attachments/426999734008283136/427220115306577920/1458416661966.png"
            },
            title: "Best girl."
          }});
         
      }
  }
}

module.exports = EssCommand;