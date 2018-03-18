const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class BellyDrumCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'bellydrum',
      group: 'pictures',
      memberName: 'bellydrum',
      description: "+6 attack"
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      title: 'Ogloza loses 50% of its max HP, but Attack raises to maximum.',
      image: {
        url: "https://cdn.discordapp.com/attachments/420043635162087446/425035720395063298/ezgif.com-gif-maker.gif"
      } 
    }});
  }
}

module.exports = BellyDrumCommand;