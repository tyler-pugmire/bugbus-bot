const request = require("request");

module.exports = { // This basically works like every normal package you use.

  ping: function(channel) { // `ping` is the name of the function, then function() is where you can pass arguments.
    channel.send("Pong!");
  },
  
  poll: function(channel, args) {
    var poll = { title: 'test', options: [ '1', '2' ] };
    
    request.post('https://strawpoll.me/api/v2/polls', {
      followAllRedirects: true, // <----
      body: poll,
      json: true
    },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      }
    );
  }
}