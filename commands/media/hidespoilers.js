const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class HideSpoilerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'hidespoilers',
      group: 'media',
      memberName: 'hidespoilers',
      description: 'Hides spoiler channels from the user.',
    });
  }

  async run(message, args) {
    let spoiler = message.guild.roles.filter(role => role.name === "SPOILERS");

    try {
      await message.member.removeRoles(spoiler);
    } catch(e) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        description: `${message.author} something went wrong contact Tyler`
      }});
      console.log(e.message);
    }
  }
}

module.exports = HideSpoilerCommand;