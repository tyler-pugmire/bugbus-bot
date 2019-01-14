const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

var response = JSON.parse(fs.readFileSync('./storage/8ball.json', 'utf8')).Response;
var url = JSON.parse(fs.readFileSync('./storage/8ball.json', 'utf8')).URL;
var img = JSON.parse(fs.readFileSync('./storage/8ball.json', 'utf8')).Image;

class Ball8Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: '8ball',
      group: 'util',
      memberName: '8ball',
      description: 'Ask the magic 8ball a question!'
    });
  }

  async run(message, args) {
    var rand = Math.floor(Math.random() * (response.length + url.length + img.length));
    console.log(rand);
    if(rand < response.length) {
      message.channel.send({embed: {
        color: parseInt(globals.messageColor),
        title: response[rand]
      }});
    }
    else if (rand < response.length + url.length) {
      message.channel.send(url[rand - response.length]);
    }
    else {
      message.channel.send({embed: {
        color: parseInt(globals.messageColor),
        image: {
          url: img[rand - response.length - url.length]
        }
      }});
    }
  }
}

module.exports = Ball8Command;