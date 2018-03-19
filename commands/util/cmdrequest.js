const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const request = require('request');

class CommandRequestCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'cmdrequest',
      group: 'util',
      memberName: 'cmdrequest',
      description: 'Create a request for a new command.',
      args: [
        {
          key: 'name',
          prompt: 'The name for the command.',
          type: 'string'
        },
        {
          key: 'description',
          prompt: 'The desription of the command. Should be put in quotation marks most of the time.',
          type: 'string',
          infinite: true
        }
      ]
    });
  }

  async run(message, args) {
    if(args.name == null || args.description == null) {
      message.channel.send({embed : {
        title: "Not enough args to create a command request.",
        color: parseInt(globals.errorColor)
      }});
      return;
    }
    
    var data = `name=${args.name}&desc=${args.description}&due=null&token=4acca553cbf025dfb4a053563c46bc5111cb175f45cc6f81ba5d78232ff98b88&key=fa9e3e9361ea8fec8b0c97d118ad3819&idList=5aaf4d054b9c993c1f3ed14f`;
    request.post({
      url: 'https://api.trello.com/1/cards?' + data,
      followAllRedirects: true,
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const embed = new Discord.RichEmbed()
        .setColor(parseInt(globals.successColor))
        .setDescription(`Command request was sent ${message.author}!`)
        message.channel.send({embed});
      } else {
        message.channel.send({embed: {
          title: "You fucked up.",
          color: parseInt(globals.errorColor),
        }});
        console.log("There was an error : " + response.statusCode);
        console.log(error);
      }
    });
  }
}

module.exports = CommandRequestCommand;