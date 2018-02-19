module.exports = { // This basically works like every normal package you use.

  ping: function(channel) { // `ping` is the name of the function, then function() is where you can pass arguments.
    channel.send("Pong!");
  },
  
  poll: function(message, args) {
    const request = require('request');
    
    //var poll = { title: title, options: options, multi: multivote, captcha: captcha };
    
    var title = args[0];
    args.shift();
    var poll = { title: title, options: args, multi: false, captcha: false};
    request.post({
      url: 'https://www.strawpoll.me/api/v2/polls',
      followAllRedirects: true,
      body: poll,
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        message.reply("Here is your poll : https://www.strawpoll.me/" + body.id);
      } else {
        message.channel.send("Sorry, there seems to have been an error, please try again");
        //console.log("There was an error : " + response.statusCode);
        console.log(error);
      }
    });
  }
}