const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class InviteCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      group: 'util',
      memberName: 'inbite',
      description: 'Gets an invite link for the discord.'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color: parseInt(globals.messageColor),
      title: "https://discord.gg/hUvf87M"
    }});
  }
}

module.exports = InviteCommand;