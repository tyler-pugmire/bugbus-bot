const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class NoBuluCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'poll',
      group: 'util',
      memberName: 'poll',
      description: 'Creates a stawpoll',
      examples: ['poll tilte option1 option2', 'poll "multiple word title" "multitple word option" option'],
      args: [
        {
          key: 'title',
          prompt: 'The title for the strawpoll.',
          type: 'string'
        },
        {
          key: 'options',
          prompt: 'n number of options for th strawpoll',
          type: 'string',
          infinite: true
        }
      ]
    });
  }

  async run(message, args) {
    const request = require('request');
    
    if(args.length < 3) {
      message.channel.send({embed : {
        title: "Not enough args to create a poll. Try !help poll",
        color: parseInt(globals.errorColor)
      }});
      return;
    }

    var poll = { title: args.title, options: args.options, multi: false, captcha: false};
    request.post({
      url: 'https://www.strawpoll.me/api/v2/polls',
      followAllRedirects: true,
      body: poll,
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const embed = new Discord.RichEmbed()
        .setColor(parseInt(globals.successColor))
        .setDescription(`Here is your poll ${message.author}!`)
        .addField(args.title, "https://www.strawpoll.me/" + body.id)
        .setImage("https://www.strawpoll.me/images/poll-results/" + body.id + ".png");
        message.channel.send({embed});
      } else {
        message.channel.send({embed: {
          title: "Sorry, there seems to have been an error, please try again",
          color: parseInt(globals.errorColor),
        }});
        console.log("There was an error : " + response.statusCode);
        console.log(error);
      }
    });
  }
}

module.exports = NoBuluCommand;