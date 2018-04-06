const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const colors = JSON.parse(fs.readFileSync('./storage/colors.json', 'utf8'));

class ColorCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'color',
      group: 'util',
      memberName: 'color',
      description: 'Changes color your name shows up as.',
      args: [
        {
          key: 'colorName',
          prompt: 'The color you want your name displayed in.',
          type: 'string'
        }
      ]
    });
  }

  async run(message, args) {
    let colors = message.guild.roles.filter(role => role.name.startsWith("$"));
    
    let role = colors.find(role => role.name.slice(1).toLowerCase() === args.colorName.toLowerCase());
    if(!role) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        description: `${message.author} Invalid color provided. Try one of these colors` + "```\n" + colors.map(x => " " + x.name.slice(1)) + "\n```"
      }});
      return;
    }

    try {
      await message.member.removeRoles(colors);
      await message.member.addRole(role);
      message.channel.send({embed: {
        color: parseInt(globals.successColor),
        description: `${message.author} Color successfully changed to ${role.name}`
      }});
    } catch(e) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        description: `${message.author} something went wrong contact Tyler`
      }});
      console.log(e.message);
    }
  }
}

module.exports = ColorCommand;