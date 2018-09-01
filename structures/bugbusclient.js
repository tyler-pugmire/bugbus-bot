const { Client } = require('discord.js-commando');
const MafiaGame = require('./mafia.js')

//const Database = require('./postgresql');

class CommandoClient extends Client {
	constructor(options) {
		super(options);
		this.database = Database.db;
		this.mafia = new MafiaGame();
		//Database.start();
	}
}

module.exports = CommandoClient;