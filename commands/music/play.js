const commando = require('discord.js-commando');
const { escapeMarkdown } = require('discord.js');
const { oneLine, stripIndents } = require('common-tags');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));
const Song = require('../../structures/song')
const ytdl = require('ytdl-core');
const winston = require('winston');
const youtube = require('../../structures/youtube')


class PlayCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Have the bot play a song in voice chat',
      args: [
				{
					key: 'url',
					prompt: 'what music would you like to listen to?\n',
					type: 'string',
          infinite: true
				}
			]
    });

    this.queue = new Map();
  }

  async run(msg, args) {
    const url = args.url.join().replace(/<(.+)>/g, '$1');
    const queue = this.queue.get(msg.guild.id);
    
    let voiceChannel;
    if(!queue) {
      voiceChannel = msg.member.voiceChannel;
      if(!voiceChannel) {
        msg.channel.send({embed : {
          color: parseInt(globals.errorColor),
          description: "You must be in a voice channel to add songs."
        }});
      } 

      const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) {
				return msg.reply('I don\'t have permission to join your voice channel. No parties allowed there.');
			}
			if (!permissions.has('SPEAK')) {
				return msg.reply('I don\'t have permission to speak in your voice channel. What a disappointment.');
      }
      
    } else if (!queue.voiceChannel.members.has(msg.author.id)) {
      msg.channel.send({embed : {
        color: parseInt(globals.errorColor),
        description: "You must be in a voice channel to add songs."
      }});
    }

    if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      console.log(playlist);
      return this.handlePlaylist(playlist, queue, voiceChannel, msg);
    } else {
      try {
        const video = await youtube.getVideo(url);
        return this.handleVideo(video, queue, voiceChannel, msg);
      } catch(error) {
        try {
          const search = args.url.join(" ");
          const videos = await youtube.searchVideos(search, 1).catch(() => msg.channel.send({embed: {
            color: parseInt(globals.errorColor),
            description: `${msg.author}, there were no search results.`
          }}));
          const video2 = await youtube.getVideoByID(videos[0].id);
          this.handleVideo(video2, queue, voiceChannel, msg);
        } catch(e) {
          msg.channel.send({embed: {
            color: parseInt(globals.errorColor),
            description: `${msg.author}, there were no search results.`
          }});
        }
      }
    }
  }

  async handleVideo(video, queue, voiceChannel, msg) {
    if(video.durationSeconds === 0) {
      msg.channel.send({embed: {
        color: parseInt(globals.errorColor),
        description: `${message.author}, Cannot play live streams.`
      }});
      return null;
    }

    if(!queue) {
      queue = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 1
      };
      this.queue.set(msg.guild.id, queue);

      const results = await this.addSong(msg, video);
			const resultMessage = {
				color: parseInt(globals.successColor),
				description: results
      };
      
      if(!results.startsWith('👍')) {
        this.queue.delete(msg.guild.id);
        msg.channel.send({embed: resultMessage});
        return null;
      }

      msg.channel.send({embed: {
        color: parseInt(globals.messageColor),
        description: `${msg.author}, trying to join your voice channel...`
      }});
      try {
        const connection = await queue.voiceChannel.join();
        queue.connection = connection;
        msg.channel.send({embed: resultMessage});
        this.play(msg.guild, queue.songs[0]);
        return null;
      } catch(error) {
        winston.error('Error occurred when joining voice channel.', error);
        this.queue.delete(msg.guild.id);
        msg.channel.send({embed: {
          color: parseInt(globals.errorColor),
          description: `${msg.author}, unable to join your voice channel.`
        }});
        return null;
      }
    } else {
      const results = await this.addSong(msg, video);
			const resultMessage = {
				color: parseInt(globals.successColor),
				description: results
      };
      msg.channel.send({embed: resultMessage});
      return null;
    }
  }

  async handlePlaylist(playlist, queue, voiceChannel, msg) {
    const videos = await playlist.getVideos();
    for(const video of Object.values(videos)) {
      const video2 = await youtube.getVideoByID(video.id);
      if(video2.duration === 0) {
        msg.channel.send({embed: {
          color: parseInt(globals.errorColor),
          description: `${message.author}, Cannot play live streams.`
        }});
        return null;
      }

      if(!queue) {
        queue = {
          textChannel: msg.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 1
        };
        this.queue.set(msg.guild.id, queue);

        const results = await this.addSong(msg, video2);
        if(!results.startsWith('👍')) this.queue.delete(msg.guild.id);

        try {
					const connection = await queue.voiceChannel.join(); // eslint-disable-line no-await-in-loop
					queue.connection = connection;
					this.play(msg.guild, queue.songs[0]);
				} catch (error) {
          this.queue.delete(msg.guild.id);
					msg.channel.send({embed: {
            color: parseInt(globals.errorColor),
            description: `${msg.author}, unable to join your voice channel.`
          }});
				}
			} else {
				await this.addSong(msg, video2); // eslint-disable-line no-await-in-loop
			}
    }
    msg.channel.send({embed: {
      color: parseInt(globals.messageColor),
      description: `${msg.author} Playlist has been added to the queue.`
    }});
  }

  addSong(msg, video) {
    const queue = this.queue.get(msg.guild.id);

    if(!this.client.isOwner(msg.author)) {
      const songMaxLength = 10;
      if(video.durationSeconds > songMaxLength * 60) {
        return oneLine`
					👎 ${msg.author} 
					(${Song.timeString(video.durationSeconds)})
					is too long. No songs longer than ${songMaxLength} minutes!
				`;
      }
      if(queue.songs.some(song => song.id === video.id)) {
        return `👎 ${msg.author} song is already in queue`;
      }
      const maxSongs = 30;
      if(queue.songs.reduce((prev, song) => prev + song.member.id === msg.author.id, 0) >= maxSongs) {
        return `👎 ${msg.author} you already have ${maxSongs} songs in the queue. Don't hog all the airtime!`;
      }
    }
    
    const song = new Song(video, msg.member);
		queue.songs.push(song);

		return `👍 ${msg.author} ${song.toString()}`;
  }

  play(guild, song) {
    
    const queue = this.queue.get(guild.id);

    if(!song) {
			queue.textChannel.send('We\'ve run out of songs! Better queue up some more tunes.');
			queue.voiceChannel.leave();
			this.queue.delete(guild.id);
			return;
    }

    let stream;
    let streamErrored = false;
    console.log(song.url);
    stream = ytdl(song.url, {audioonly: true}).on('error',  err => {
      streamErrored = true;
      queue.textChannel.send('Couldn\'t play song.');
      queue.songs.shift();
      this.play(guild, queue.songs[0]);
    });

    const dispatcher = queue.connection.playStream(stream, {passes: 3})
      .on('end', () => {
        if(streamErrored) return;
        queue.songs.shift();
        this.play(guild, queue.songs[0]);
      })
      .on('error', err => {
        queue.textChannel.send(`An error occurred while playing the song: \`${err}\``);
      });
      queue.connection.player.opusEncoder.setPLP(0.01);
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      song.dispatcher = dispatcher;
      song.playing = true;
  }
}

module.exports = PlayCommand;