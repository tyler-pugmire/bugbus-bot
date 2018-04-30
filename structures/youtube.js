const YouTube = require('simple-youtube-api');
module.exports = new YouTube(process.env.GOOGLE_API);