const request = require('request');
const RichEmbed = require('discord.js').RichEmbed;
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const db = JSON.parse(fs.readFileSync('./storage/db.json', 'utf8')).mainDB;

class StreamNotification {
  constructor(client) {
    this.client = client;
    this.guild = 0;
    this.channel = {};
    this.streamers = {};

    this.userIds = [];
  }

  handleStreams(error, response, body) {
    if(!error && response.statusCode == 200) {
      console.log(body.data.length)
      var users = [];
      for(var i = 0; i < body.data.length; ++i) {
        let stream = body.data[i]
        console.log(stream)
        if(stream.type == '') {
          this.streamers[stream.user_name].online = false;
        } else {
          users.push(stream.user_name);
          this.streamers[stream.user_name].online = true;

          if(this.channel != null && this.streamers[stream.user_name].prevonline != this.streamers[stream.user_name].online) {
            let preview = stream.thumbnail_url.replace('{width}', '500')
            preview = preview.replace('{height}', '300')

            let embed = new RichEmbed();
            embed.setColor(parseInt(globals.messageColor));
            embed.setTitle(stream.title);
            embed.setURL(`https://www.twitch.tv/${stream.user_name}`);
            //embed.setAuthor(stream.user_name, stream.channel.logo, stream.channel.url);
            embed.setDescription(`@here ${stream.user_name} has gone live!`);
            //embed.setThumbnail(stream.channel.logo);
            //embed.addField("Currently playing", stream.channel.game);
            embed.setImage(preview);
            this.channel.send(embed);
          }
        }
      }
      for(var key in this.streamers) {
        if(!users.includes(key)) {
          this.streamers[key].online = false;
        }
      }
      for(var key in this.streamers) {
        this.streamers[key].prevonline = this.streamers[key].online;
      }
    } else {
      console.log(response)
      console.log(error);
    }
  }

  storeUserIDs(error, response, body) {
    if(!error && response.statusCode == 200) {
      let users = body.data;
      this.userIds = [];
      for(var i = 0; i < users.length; ++i) {
        this.userIds.push(users[i].id);
        request.get({
          url: `https://api.twitch.tv/helix/streams?user_id=${this.userIds.join('&user_id=')}`,
          headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID
          },
          followAllRedirects: true,
          json: true
        }, this.handleStreams.bind(this));
      }
      
    }
    else {
      console.log(response)
      console.log(error);
    }
  }
  
  async run() {
    var guilds = this.client.guilds.array();
    for(var i = 0; i < guilds.length; ++i) {
      this.guild = guilds[i].id;
      if(!db.hasOwnProperty(guilds[i].id)) {
        console.log("guild not found");
        continue;
      }
      var guilddb = db[guilds[i].id];
      if(!guilddb.hasOwnProperty("stream_channel")) {
        console.log("no stream channel");
        continue;
      }
      var channelID = guilddb["stream_channel"];
      this.channel = guilds[i].channels.get(channelID);
      if(!guilddb.hasOwnProperty("streamers")) {
        console.log("no streams");
        return;
      }
      this.streamers = guilddb["streamers"];
      let keys = Object.keys(this.streamers);
      request.get({
        url: `https://api.twitch.tv/helix/users?login=${keys.join('&login=')}`,
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID
        },
        followAllRedirects: true,
        json: true
      }, this.storeUserIDs.bind(this));
    }
  }
}

module.exports = StreamNotification;
