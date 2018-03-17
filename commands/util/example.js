const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class ExampleCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'example',
      group: 'util',
      memberName: 'example',
      description: 'An example Command!'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color: parseInt(globals.messageColor),
      title: "This is an example command!"
    }});
  }
}

module.exports = ExampleCommand;