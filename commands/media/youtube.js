const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const request = require('request');
const youtube = require('../../structures/youtube')


class YoutubeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'youtube',
      group: 'media',
      memberName: 'youtube',
      description: 'Lookup a youtube video',
      args: [
          {
            key: 'search',
            prompt: 'What to search for.',
            type: 'string',
            infinite: true
          }
      ]
    });
  }

  async run(message, args) {
    const search = args.search.join(" ");
    console.log(search);
    const videos = await youtube.searchVideos(search, 1).catch(() => message.channel.send({embed: {
      color: parseInt(globals.errorColor),
      description: `${message.author}, there were no search results.`
    }}));
    if(videos.length == 0) {
      message.channel.send({embed: {
        color: parseInt(globals.errorColor),
        description: `${message.author}, there were no search results.`
      }});
      return;
    }
    console.log(videos);
    message.channel.send(`https://youtube.com/watch?v=${videos[0].id}`);
  }
}

module.exports = YoutubeCommand;