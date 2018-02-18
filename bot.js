var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

function CustomCommand() {
  this.cmd;
  this.msg;
}

var customCommand = [];
var mod;
var bestmod;
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];
    var member = bot.servers[bot.channels[channelID].guild_id].members[userID];
    var roles = bot.servers[bot.channels[channelID].guild_id].roles;
    for(var key in roles) {
      if(roles[key].name == 'mod') {
        mod = roles[key].id;
      }
      else if(roles[key].name == '!bestmod') {
        bestmod = roles[key].id;
      }
    }
    
    args = args.splice(1);
    switch(cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({to: channelID, message: 'Pong!' });
      break;
      // Just add any case commands if you want to..
      case 'addcmd':
        if(member.roles.includes(mod) || member.roles.includes(bsetmod)) {
          var customcmd = new CustomCommand();
          customcmd.cmd = args[0];
          customcmd.msg = args[1]; 
          customCommand.push(customcmd);
          bot.sendMessage({ to: channelID, message: args[0] });
        }
      break;
    default:
      for (var i = 0; i < customCommand.length; i++) {
        if(cmd == customCommand[i].cmd) {
          bot.sendMessage({ to: channelID, message: customCommand[i].msg });
        }
      }
    }
  }
});