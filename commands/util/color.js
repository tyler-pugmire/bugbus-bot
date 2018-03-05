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
    //if(args.length != 1) {
    //  var colorString = "";
    //  for(var key in colors) {
    //    colorString += colors[key].name + ', ';
    //  }
    //  colorString = colorString.slice(0, -2);
    //  message.channel.send({embed: {
    //    color: parseInt(globals.errorColor),
    //    description: `${message.author} Not correct number of args. Try one of these colors` + "```\n" + colorString + "\n```"
    //  }})
//
    //  return;
    //}
    var guild = message.member.guild;
    var validColor = false;
    var name;
    for(var key in colors) {
      if(colors[key].name.toLowerCase() == args.colorName.toLowerCase()) {
        name = key;
        validColor = true;
        break;
      }
    }

    if(!validColor) {
      var colorString = "";
      for(var key in colors) {
        colorString += colors[key].name + ', ';
      }
      colorString = colorString.slice(0, -2);
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        description: `${message.author} Invalid color provided. Try one of these colors` + "```\n" + colorString + "\n```"
      }})

      return;
    }

    const roleName = "Color_" + name;
    /*Aqua, DarkAqua, Green, LightGreen, DarkGreen, 
      Blue, DarkBlue, Cyan, DarkCyan, Purple, 
      DarkPurple, Magenta, DarkMagenta, Gold, DarkGold, 
      Orange, LightOrange, DarkOrange, Red, LightRed, 
      DarkRed, Pink, Fuschia, Yellow, Black,
      White, Navy, DarkNavy*/
    const rolesArray = guild.roles.array();
    var roleExists = false;
    var setRole;
    for(var i = 0; i < rolesArray.length; ++i) {
      if(rolesArray[i].name === roleName) {
        roleExists = true;
        setRole = rolesArray[i];
      }
    }

    var memberRoles = message.member.roles.array();
    var removeRoles = [];
    for(var i = 0; i < memberRoles.length; ++i) {
      if(memberRoles[i].name.startsWith("Color_")) {
        removeRoles.push(memberRoles[i]);
      }
    }
    if(removeRoles.length != 0)
      message.member.removeRoles(removeRoles);

    if(roleExists) {
      message.member.addRole(setRole);
      message.channel.send({embed: {
        color: parseInt(globals.successColor),
        description: `${message.author} Color successfully changed to ${name}`
      }})
    }
    else {
      message.guild.createRole({
         name: roleName,
         color: colors[name].value,
         permissions: []
      }).then(function(role) {
         message.member.addRole(role);
         message.channel.send({embed: {
          color: parseInt(globals.successColor),
          description: `${message.author} Color successfully changed to ${name}`
        }})
      });
    }
  }
}

module.exports = ColorCommand;