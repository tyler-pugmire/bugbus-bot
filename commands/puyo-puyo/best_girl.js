const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class BestGirlCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'bestgirl',
      group: 'puyo-puyo',
      memberName: 'best girl',
      description: 'jess does not know who best girl is'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      title: "Fuck puyo.",
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/430884140758597635/490619050221764618/maxresdefault.jpg"
      } 
    }});
  }
}

module.exports = BestGirlCommand;