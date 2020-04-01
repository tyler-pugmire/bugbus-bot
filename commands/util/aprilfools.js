const commando = require('discord.js-commando');

class AprilFools2020Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'aprilfools',
      group: 'util',
      memberName: 'aprilfools',
      description: 'Toggle April Fools'
    });
  }

  async run(message, args) {
    require('./../../structures/april_fools_2020.js').enabled = !require('./../../structures/april_fools_2020.js').enabled;
  }
}
module.exports = AprilFools2020Command;