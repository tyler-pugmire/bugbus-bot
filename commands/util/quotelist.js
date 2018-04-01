const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const quotes = JSON.parse(fs.readFileSync('./storage/quotes.json', 'utf8')).quotes;
var ListOfQuotes = quotes.toString();
const RichEmbed = require('discord.js').RichEmbed;


class QuoteListCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'quotelist',
      group: 'util',
      memberName: 'quotelist',
      description: 'displays the list of quotes',
    });
}
async run(message, args){
    var embed = new RichEmbed ();
    embed.setTitle("These are the quotes");
    for(var i = 0; i < quotes.length; ++i ) 
    {
    embed.addField(i +1,quotes[i] );
    }
    message.author.sendMessage(embed);
}
}
module.exports = QuoteListCommand