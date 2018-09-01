const commando = require('discord.js-commando');

var Phases = Object.freeze({"day":1, "night":2});

class MafiaGame {
  constructor() {
    this.lobby = false;
    this.running = false;
    this.players = [];
    this.mafiaso = [];
    this.role;
    this.phase = Phases.Day;
  }

  beginLobby() {
    this.lobby = true;
  }

  playerJoin(player) {
    this.players.push(player);
  }

  async beginGame(client) {
    //var first = getRandomInt(players.length - 1);
    //var second = getRandomInt(players.length - 1);
    //while(second == first) {
    //  var second = getRandomInt(players.length - 1);
    //}

    //this.mafiaso.push(this.players[first]);
    //this.mafiaso.push(this.players[second]);
    let guild = client.guilds.find("id", "482425662251073537");
    let channel = guild.channels.find("id", "482425662251073539");
    for(var i = 0; i < this.players.length; ++i) {
      const invite = await channel.createInvite({
        temporary: true, 
        maxAge: 60, 
        maxUses: 1, 
        unique: true 
      }).catch(console.error);
      console.log(invite);
      this.players[i].send("You are in the game! " + invite.url);
    }
  }
}

module.exports = MafiaGame;