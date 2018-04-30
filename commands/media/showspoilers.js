const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class ShowSpoilerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'showspoilers',
      group: 'media',
      memberName: 'showspoilers',
      description: 'Give user role that allows them to see spoiler channels.',
    });
  }

  async run(message, args) {
    let spoiler = message.guild.roles.filter(role => role.name === "SPOILERS");

    try {
      await message.member.addRoles(spoiler);
    } catch(e) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        description: `${message.author} something went wrong contact Tyler`
      }});
      console.log(e.message);
    }
  }
}

module.exports = ShowSpoilerCommand;