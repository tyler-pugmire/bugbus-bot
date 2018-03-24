const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
class CoinFlipCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'flip',
      group: 'util',
      memberName: 'flip',
      description: 'flips a coin'
    });
  }

  async run(message, args) {
      var flip = Math.floor(Math.random()*2) +1 ;
      if (flip == 1) {
          message.channel.send({embed: {
  color: parseInt(globals.messageColor),
  title: "You flipped heads"
}}); 
      } else {
        message.channel.send({embed: {
            color: parseInt(globals.messageColor),
            title: "You flipped tails"
          }});
         
      }
  }
}

module.exports = CoinFlipCommand;