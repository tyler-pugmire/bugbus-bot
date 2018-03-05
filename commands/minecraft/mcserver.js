const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class MinecraftServerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'mcserver',
      group: 'minecraft',
      memberName: 'mcserver',
      description: 'Gets information for the Minecraft server.'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color: parseInt(globals.messageColor),
      title: "ogcahchat.aternos.me"
    }});
  }
}

module.exports = MinecraftServerCommand;