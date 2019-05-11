const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const RichEmbed = require('discord.js').RichEmbed;

function createChannel(message, name, overrides) {
  message.channel.guild.createChannel(name, 'text', [{
    id: message.channel.guild.defaultRole.id,
    deny: overrides
  }]).then(channel => {
    let category = message.channel.guild.channels.find(c => c.name == "spoilers" && c.type == "category");
    if(!category) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        description: `${message.author} something went wrong contact Tyler`
      }});
      return;
    }
    channel.setParent(category.id);
  });
}

class SpoilerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'spoiler',
      group: 'media',
      memberName: 'spoiler',
      description: 'Create a room to talk about spoilers.',
      args: [
        {
          key: 'option',
          prompt: 'Would you like to create or join a room.',
          type: 'string'
        },
        {
          key: 'topic',
          prompt: 'Name of the topic you want a channel for.',
          type: 'string',
          default: ''
        },
      ]
    });
  }

  async run(message, args) {
    if(args.option == "create") {
      createChannel(message, args.topic, ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES"])
      createChannel(message, args.topic + "-spoilers", ["SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES"]);
    }
    else if(args.option == "join") {
      let category = message.channel.guild.channels.find(c => c.name == "spoilers" && c.type == "category");
      if(!category) {
        message.channel.send({embed: {
          color: parseInt(globals.errorColor),
          description: `${message.author} something went wrong contact Tyler`
        }});
        return;
      }

      let channels = category.children.array();
      if(channels == null) {
        return;
      }
      var embed = new RichEmbed();
      embed.setTitle("Reply with the room number you want to join or reply with cancel to cancel.");
      for(var i = 0; i < channels.length; ++i) {
        if(i % 2 == 0) {
          embed.addField((i / 2) + 1, channels[i]);
        }
      }
      message.channel.send(embed).then(q => q.delete(15000))
      const filter = m => m.author.id === message.author.id;
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 15000
      }).then(collected => {
        if (collected.first().content === 'cancel') {
          return message.reply("Canceled.");
        }

        let room = collected.first().content;
        if(room < 1 || room > channels.length / 2) {
          message.reply("Invalide room number");
          return;
        }
        message.reply(`You can now talk about spoilers in ${channels[(room - 1) * 2].name}`);
        channels[(room - 1) * 2].overwritePermissions(message.author, {
          "VIEW_CHANNEL" : true,
          'READ_MESSAGE_HISTORY' : true, 
          'SEND_MESSAGES' : true, 
          'SEND_TTS_MESSAGES' : true, 
          'MANAGE_MESSAGES' : true,
        });
        channels[((room - 1) * 2) + 1].overwritePermissions(message.author, {
          "VIEW_CHANNEL" : false, 
          'READ_MESSAGE_HISTORY' : false, 
          'SEND_MESSAGES' : false, 
          'SEND_TTS_MESSAGES' : false, 
          'MANAGE_MESSAGES' : false,
        });
      });
    }
    else {
      message.reply("Invalid use of command.")
    }
  }
}

module.exports = SpoilerCommand;