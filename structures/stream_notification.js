const request = require('request');
const RichEmbed = require('discord.js').RichEmbed;
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const db = JSON.parse(fs.readFileSync('./storage/db.json', 'utf8')).mainDB;

Object.filter = function(obj, predicate) {
  var result = [], key;
  for(key in obj) {
    if(obj.hasOwnProperty(key) && predicate(obj[key])) {
      result.push(obj[key])
    }
  }
  return result
}

class StreamNotification {
  constructor(client) {
    this.client = client;
    this.guild = 0;
    this.channel = {};
    this.streamers = {};

    this.userIds = [];
    this.stream_infos = { };
  }

  handleStreams(data) {
      let keys = Object.keys(this.streamers);
      for(var i = 0; i < keys.length; ++i) {
        var found = false;
        for(var j = 0; j < data.length; ++j) {
          let stream = data[j]
          if(stream.user_name.toLowerCase() == keys[i].toLowerCase()) {
            found = true;
            this.streamers[keys[i]].online = true;
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
        this.streamers[keys[i]].online = found;
      }
      for(var key in this.streamers) {
        this.streamers[key].prevonline = this.streamers[key].online;
      }
  }

  gamesResponseImpl(games) {
    let live_channels = Object.filter(this.stream_infos, stream => stream.live == true)
    for(var i = 0; i < live_channels.length; ++i) {
      let stream = live_channels[i]
      this.streamers[stream.username].online = true
      if(this.channel != null && this.streamers[stream.username].prevonline != this.streamers[stream.username].online) {
        let embed = new RichEmbed();
        embed.setColor(parseInt(globals.messageColor));
        embed.setTitle(stream.title);
        let url = `https://www.twitch.tv/${stream.username}`
        embed.setURL(url);
        embed.setAuthor(stream.username, stream.icon, url);
        embed.setDescription(`@here ${stream.username} has gone live!`);
        embed.setThumbnail(stream.icon);
        let game = games.filter(g => g.id == stream.game_id)[0].name
        embed.addField("Currently playing", game);
        embed.setImage(stream.thumbnail_url);
        this.channel.send(embed);
      }
    }
    for(var key in this.streamers) {
      this.streamers[key].prevonline = this.streamers[key].online;
      this.streamers[key].online = false;
    }
  }

  gamesResponse(error, response, body) {
    if(!error && response.statusCode == 200) {
      this.gamesResponseImpl(body.data)
    } else {
      console.log(response)
      console.log(error);
    }
  }

  streamsResponseImpl(streams) {
    var game_ids = []
    for(var i = 0; i < streams.length; ++i) {
      let stream = streams[i];
      game_ids.push(stream.game_id)
      this.stream_infos[stream.user_name]["game_id"] = stream.game_id
      this.stream_infos[stream.user_name]["title"] = stream.title
      this.stream_infos[stream.user_name]["live"] = true;
      

      let preview = stream.thumbnail_url.replace('{width}', '640')
      preview = preview.replace('{height}', '360')
      this.stream_infos[stream.user_name]["thumbnail_url"] = preview
    }
    request.get({
      url: `https://api.twitch.tv/helix/games?id=${game_ids.join('&id=')}`,
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID
      },
      followAllRedirects: true,
      json: true
    }, this.gamesResponse.bind(this));
  }

  streamsResponse(error, response, body) {
    if(!error && response.statusCode == 200) {
      this.streamsResponseImpl(body.data)
    } else {
      console.log(response)
      console.log(error);
    }
  }

  userResponseImpl(users) {
    this.stream_infos = { }
    this.userIds = []
    for(var i = 0; i < users.length; ++i) {
      let user = users[i]
      let username = user.display_name
      this.userIds.push(user.id);
      this.stream_infos[username] = { }
      this.stream_infos[username]["username"] = user.display_name
      this.stream_infos[username]["id"] = user.id
      this.stream_infos[username]["description"] = user.description
      this.stream_infos[username]["icon"] = user.profile_image_url
      this.stream_infos[username]["live"] = false
    }
    request.get({
      url: `https://api.twitch.tv/helix/streams?user_id=${this.userIds.join('&user_id=')}`,
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID
      },
      followAllRedirects: true,
      json: true
    }, this.streamsResponse.bind(this));
  }

  userResponse(error, response, body) {
    if(!error && response.statusCode == 200) {
      this.userResponseImpl(body.data)  
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
      }, this.userResponse.bind(this));
    }
  }
}

module.exports = StreamNotification;
