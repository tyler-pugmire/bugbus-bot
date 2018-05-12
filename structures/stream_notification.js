const request = require('request');
const RichEmbed = require('discord.js').RichEmbed;
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const db = JSON.parse(fs.readFileSync('./storage/streams.json', 'utf8')).mainDB;

class StreamNotification {
  constructor(client) {
    this.client = client;
    this.guild = 0;
    this.channel = {};
    this.streamers = {};
  }

  handleStreams(error, response, body) {
    if(!error && response.statusCode == 200) {
      console.log(body);
      let channels = Object.keys(this.streamers);
      console.log(channels);
      for (var i = 0; i < channels.length; ++i) {
        let channel = channels[i];
        console.log(channel);
        let stream = body.streams.find(function(o) {
          return o.channel && o.channel.name == channel.toLowerCase();
        });
        if(stream == null) {
          this.streamers[channel].online = false;
        } else {
          this.streamers[channel].online = true;
          if(this.channel != null && this.streamers[channel].prevonline != this.streamers[channel].online) {
            let embed = new RichEmbed();
            embed.setColor(parseInt(globals.messageColor));
            embed.setTitle(stream.channel.status);
            embed.setURL(stream.channel.url);
            embed.setAuthor(stream.channel.display_name, stream.channel.logo, stream.channel.url);
            embed.setDescription(`@here ${stream.channel.display_name} has gone live!`);
            embed.setThumbnail(stream.channel.logo);
            embed.addField("Currently playing", stream.channel.game);
            embed.setImage(stream.preview.large);
            this.channel.send(embed);
            let subs = this.streamers[channel].subs;
            if(subs != null) {
              embed.setDescription(`${stream.channel.display_name} has gone live!`);
              for(var j = 0; j < subs.length; ++j) {
                let g = this.client.guilds.find("id", this.guild);
                g.members.find('id', subs[j]).send(embed);
              }
            }
          }
        }
      }
      for(var key in this.streamers) {
        this.streamers[key].prevonline = this.streamers[key].online;
      }
    } else {
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
      console.log(this.channel);
      if(!guilddb.hasOwnProperty("streamers")) {
        console.log("no streams");
        return;
      }
      this.streamers = guilddb["streamers"];
      let keys = Object.keys(this.streamers);
      console.log(keys.toString());
      request.get({
        url: `https://api.twitch.tv/kraken/streams?limit=${keys.length}&channel=${keys.toString()}`,
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID
        },
        followAllRedirects: true,
        json: true
      }, this.handleStreams.bind(this));
    }
  }
}

module.exports = StreamNotification;
