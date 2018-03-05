const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class PingCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'util',
      memberName: 'ping',
      description: 'Bot responds with Pong!'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color: parseInt(globals.messageColor),
      title: "Pong!"
    }});
  }
}

module.exports = PingCommand;