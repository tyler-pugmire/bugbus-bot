const commando = require('discord.js-commando');
const fs = require('fs');
const pictures = JSON.parse(fs.readFileSync('./storage/puyopics.json', 'utf8')).Pictures;
const text = JSON.parse(fs.readFileSync('./storage/puyotext.json', 'utf8')).Text;
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));


class PuyoCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'puyo',
      group: 'puyo-puyo',
      memberName: 'puyo',
      description: 'randomly picks a puyo puyo pic posted by jess',
      throttling: {
        usages: 3,
        duration: 1800
     }
    });
  }

  async run(message, args) {
      message.delete();
      var WhichPic = Math.floor(Math.random()*(pictures.length + text.length - 1));
      if (WhichPic >= pictures.length) {
        message.channel.send({embed: {
          color: parseInt(globals.messageColor),
          title: text[WhichPic - pictures.length]
        }});
      } else {
        message.channel.send({embed: {
          color: parseInt(globals.messageColor),
          image: {
            url: pictures[WhichPic]
          }
        }});

      }

      


      }

  }


module.exports = PuyoCommand;