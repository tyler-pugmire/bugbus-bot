const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const request = require('request');
const didyoumean = require('didyoumean');
var cardList = [];

class YugiohCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'ygo',
      group: 'yugioh',
      memberName: 'ygo',
      description: 'Gets information on desired Yu-Gi-Oh card.',
      args: [
        {
          key: 'card',
          prompt: 'Name of the card to search for.',
          type: 'string'
        }
      ]
    });

    request.get({
      url: 'https://www.ygohub.com/api/all_cards',
      followAllRedirects: true,
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        cardList = body.cards;
        console.log(cardList);
      } else {
        console.log("There was an error : " + response.statusCode);
        console.log(error);
      }
    });
    
  }

  async run(message, args) {
    console.log(args.card);
    didyoumean.threshold = null;
    var word = didyoumean(args.card, cardList);
    request.get({
      url: `https://www.ygohub.com/api/card_info?name=${word}`,
      followAllRedirects: true,
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        message.channel.send({embed: {
          color: parseInt(globals.successColor),
          title: body.card.name,
          image: {
            url: body.card.image_path
          }
        }});
        console.log(word);
      } else {
        console.log("There was an error : " + response.statusCode);
        console.log(error);
      }
    });
  }
}

module.exports = YugiohCommand;