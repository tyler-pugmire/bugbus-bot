exports.run = (bot, message, args, func) => {
  func.poll(message.channel, args);
}