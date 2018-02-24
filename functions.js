const fs = require('fs');
const commands = JSON.parse(fs.readFileSync('./storage/commands.json', 'utf8'));
const colors = JSON.parse(fs.readFileSync('./storage/colors.json', 'utf8'));

const msgColor = 0x1D82B6;
const successColor = 0x00FF00;
const errorColor = 0xFF0000;

module.exports = { // This basically works like every normal package you use.

  ping: function(channel) { // `ping` is the name of the function, then function() is where you can pass arguments.
    channel.send({embed: {
      color: msgColor,
      title: "Pong!"
    }});
  },
  
  poll: function(Discord, message, args) {
    const request = require('request');
    
    if(args.length < 3) {
      message.channel.send({embed : {
        title: "Not enough args to create a poll. Try !help poll",
        color: errorColor
      }});
      return;
    }
       
    var title = args[0];
    args.shift();
    var poll = { title: title, options: args, multi: false, captcha: false};
    request.post({
      url: 'https://www.strawpoll.me/api/v2/polls',
      followAllRedirects: true,
      body: poll,
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const embed = new Discord.RichEmbed()
        .setColor(successColor)
        .setDescription(`Here is your poll ${message.author}!`)
        .addField(title, "https://www.strawpoll.me/" + body.id)
        .setImage("https://www.strawpoll.me/images/poll-results/" + body.id + ".png");
        message.channel.send({embed});
      } else {
        message.channel.send({embed: {
          title: "Sorry, there seems to have been an error, please try again",
          color: errorColor,
        }});
        console.log("There was an error : " + response.statusCode);
        console.log(error);
      }
    });
  },

  bugbus: function(channel) {
    channel.send({embed: {
      color : msgColor,
      image: {
        url: "https://cdn.discordapp.com/attachments/414626170441564173/414649261314277386/Snapchat-931093747.jpg"
      } 
    }});
  },

  help: function(Discord, message, args) {
    if(args.length === 0) {
      const onlyHelp = new Discord.RichEmbed()
      .setColor(msgColor);

      let commandsFound = 0;

      for(var cmd in commands) {
        ++commandsFound;
        onlyHelp.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** !${commands[cmd].usage}`);
      }

      onlyHelp.setFooter(`Currently showing all commands. To view a specific group do !help [group / command]`)
      onlyHelp.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional`)

      // We can output it two ways. 1 - Send to DMs, and tell them that they sent to DMs in chat. 2 - Post commands in chat. [since commands take up a lot let's send to DMs]
      message.author.send("", onlyHelp);
      // Post in chat they sent to DMs

      const embed = new Discord.RichEmbed()
      .setColor(msgColor)
      .setDescription(`**Check your DMs ${message.author}!**`);

      message.channel.send({embed})
    }
  },

  color: function(bot, message, args) {
    
    if(args.length != 1) {
      var colorString = "";
      for(var key in colors) {
        colorString += colors[key].name + ', ';
      }
      colorString = colorString.slice(0, -2);
      message.channel.send({embed: {
        color: errorColor,
        description: `${message.author} Not correct number of args. Try one of these colors` + "```\n" + colorString + "\n```"
      }})

      return;
    }
    var guild = message.member.guild;
    const roleName = "Color_" + args[0];
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
    console.log(memberRoles.length);
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
    }
    else {
      message.guild.createRole({
         name: roleName,
         color: colors[args[0]].value,
         permissions: []
      }).then(function(role) {
         message.member.addRole(role);
      });
    }
  },

  nobulu: function(channel) {
    channel.send({embed: {
      color : msgColor,
      image: {
        url: "https://cdn.discordapp.com/attachments/414626170441564173/416836490585178112/Snapchat-453895809.jpg"
      } 
    }});
  }
}