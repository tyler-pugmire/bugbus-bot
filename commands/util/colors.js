const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const colors = JSON.parse(fs.readFileSync('./storage/colors.json', 'utf8'));

class ColorCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'colors',
      group: 'util',
      memberName: 'colors',
      description: 'Shows all colors available to server.'
    });
  }

  async run(message, args) {
    let colors = message.guild.roles.filter(role => role.name.startsWith("$"));
    message.channel.send({embed: {
      color: parseInt(globals.messageColor),
      description: colors.array().join(" ")
    }});
  }
}

module.exports = ColorCommand;