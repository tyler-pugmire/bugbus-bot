const request = require('request');
const RichEmbed = require('discord.js').RichEmbed;
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

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
            embed.setImage(stream.preview.medium);
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
      this.client.provider.set(this.guild, "streamers", this.streamers);
    } else {
      console.log(error);
    }
  }
  
  async run() {
    var guilds = this.client.guilds.array();
    for(var i = 0; i < guilds.length; ++i) {
      this.guild = guilds[i].id;
      var channelID = this.client.provider.get(this.guild, "stream_channel", 0);
      this.channel = guilds[i].channels.get(channelID);
      this.streamers = this.client.provider.get(this.guild, "streamers", null)
      if(this.streamers != null) {
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
}

module.exports = StreamNotification;

//function streamStatus(channel, stream) {
//  request.get({
//		url: 'https://api.twitch.tv/kraken/streams?limit=25&channel=' + channel,
//		headers: {
//      'Client-ID': process.env.TWITCH_CLIENT_ID
//    },
//		followAllRedirects: true,
//		json: true
//	},
//	function(error, response, body) {
//		if (!error && response.statusCode == 200) {
//      console.log(body);
//      if(body.streams.length == 0) {
//        stream.online = false;
//      }
//      for(var i = 0; i < body.streams.length; ++i) {
//        if(body.streams[i].channel == null) {
//          stream.online = false;
//        }
//        else {
//          console.log(body.streams[i].channel);
//          stream.online = true;
//        }
//      }
//		}
//		else {
//			stream.online = false;
//		}
//	});
//}

//for(var key in streamers) {
//  console.log(key);
//  const prevStatus = Boolean(streamers[key].online);
//  console.log("Previous: " + prevStatus);
//  streamStatus(key, streamers[key]);
//  console.log("Current: " + streamers[key].online);
//
//  var guilds =this.client.guilds.array();
//  for(var i = 0; i < guilds.length; ++i) {
//    var channelID = this.client.provider.get(guilds[i].id, "stream_channel", 0);
//    console.log(channelID);
//    if(channelID != 0) {
//      var channel = guilds[i].channels.get(channelID);
//      if(prevStatus != streamers[key].online) {
//        if(streamers[key].online) {
//          console.log("online");
//          channel.send("Stream Online");
//        }
//        else {
//          console.log("offline");
//          channel.send("Stream offline");
//        }
//      }
//    }
//  }
//}