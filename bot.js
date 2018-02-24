const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');

const func = require('./functions.js'); // If this returns an error for you (or you might be on ubuntu/linux), try '../functions.js'
console.log(func);

// Global Settings
const prefix = '!'; // This is the prefix, you can change it to whatever you want.

// Listener Event: Runs whenever a message is received.
bot.on('message', message => {
  // Variables - Variables make it easy to call things, since it requires less typing.
  let msg = message.content.toLowerCase(); // This variable takes the message, and turns it all into uppercase so it isn't case sensitive.
  let sender = message.author; // This variable takes the message, and finds who the author is.
  let args = message.content.slice(prefix.length).trim().split(" "); // This variable slices off the prefix, then puts the rest in an array based off the spaces
  let cmd = args.shift().toLowerCase(); // This takes away the first object in the cont array, then puts it in this.
  
  if (sender.bot) 
    return;
  if (!message.content.startsWith(prefix)) 
    return;

  try {
    let commandFile = require(`./commands/${cmd}.js`); // This will assign that filename to commandFile
    commandFile.run(Discord, bot, message, args, func); // This will add the functions, from the functions.js file into each commandFile.
  } catch(e) { // If an error occurs, this will run.
    console.log(e.message); // This logs the error message
  } finally { // This will run after the first two clear up
    console.log(`${message.author.username} ran the command: ${cmd}`);
  }
});

// Listener Event: Runs whenever the bot sends a ready event (when it first starts for example)
bot.on('ready', () => {
    // We can post into the console that the bot launched.
    console.log('Bot started.');
    
});


bot.login(require('./auth.json').token);

