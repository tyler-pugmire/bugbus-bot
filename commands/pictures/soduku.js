const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class SudokuCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'sudoku',
      group: 'pictures',
      memberName: 'sudoku',
      description: '"when people started calling me fabio I considered sudoku. I had 10 tide pods in my mouth but I found Jesus" - Fabio, 2018'
    });
  }

  async run(message, args) {
    message.channel.send({embed: {
      color : parseInt(globals.messageColor),
      image: {
        url: "https://cdn.discordapp.com/attachments/414626170441564173/417405632421953538/image.jpg"
      } 
    }});
  }
}

module.exports = SudokuCommand;