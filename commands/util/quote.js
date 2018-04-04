const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const quotes = JSON.parse(fs.readFileSync('./storage/quotes.json', 'utf8')).quotes;

class QuoteCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'quote',
      group: 'util',
      memberName: 'quote',
      description: 'picks a quote to display',
      args: [
        {
            key: 'quote',
            prompt: 'which quote you want',
            type: 'integer',
            default:-1,
            infinite : false,
            validate: quote => {
                if (quote <= quotes.length) return true;
                return "We don't have that many quotes";
                
            }
          },
          {
            key: 'anon',
            prompt: 'shhhh',
            type: 'string',
            default: ""
          }
        ]
      });
    }


      


async run(message, args){
    console.log (args.quote);
    if(args.quote  <= 0) {
        args.quote = Math.floor(Math.random()*quotes.length +1);
        console.log(args.quote);
}
        message.channel.send({embed:{
            color: parseInt(globals.messageColor),
            title: quotes[args.quote - 1]
        }});
        if (args.anon== 'anon'){
            message.delete();

        }

    }
      }
    



module.exports = QuoteCommand;