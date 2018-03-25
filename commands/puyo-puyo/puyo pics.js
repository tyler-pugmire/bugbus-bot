const commando = require('discord.js-commando');
const fs = require('fs');
const globals = JSON.parse(fs.readFileSync('./storage/globals.json', 'utf8'));

class PuyoCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'puyo',
      group: 'puyo-puyo',
      memberName: 'puyo',
      description: 'randomly picks a puyo puyo pic posted by jess'
    });
  }

  async run(message, args) {
      var WhichPic = Math.floor(Math.random()*27);
      //remember that ==0 is a thing
      if (WhichPic == 0) {
          message.channel.send({embed: {
              color : parseInt(globals.messageColor),
              title: ('$50 tetris')
          }});
      }
      if (WhichPic == 1) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427001531930378260/img403805_l.png"
            } 
          }});
      }
      if (WhichPic == 2) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427002179438641153/unknown.png"
            } 
          }});
      }
      if (WhichPic == 3) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427003300723032064/images.png"
            } 
          }});
      }
      if (WhichPic == 4) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427003913967894530/images.png"
            } 
          }});
      }
      if (WhichPic == 5) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427016183368253441/puyo_cut_small_2537.png"
            } 
          }});
      }
      if (WhichPic == 6) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427016396371918849/37294-1923922090.jpg"
            } 
          }});
      }
      if (WhichPic == 7) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427016396904464384/img104104_l.png"
            } 
          }});
      }
      if (WhichPic == 8) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427016396904464386/BSA4RBSCEAEUEOQ.png"
            } 
          }});
      }
      if (WhichPic == 9) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427016397424427008/f02846b6058f228b5f81d34b8a70516d--anime-art.jpg"
            } 
          }});
      }
      if (WhichPic == 10) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427016397424427009/37294-115537184.jpg"
            } 
          }});
      }
      if (WhichPic == 11) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427016397890256905/BSA49lLCYAIkZVv.png"
            } 
          }});
      }
      if (WhichPic == 12) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427193210712883210/Img102603_l.png"
            } 
          }});
      }
      if (WhichPic == 13) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427206111473696769/2367935-rider.png"
            } 
          }});
      }
      if (WhichPic == 14) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427220115306577920/1458416661966.png"
            } 
          }});
      }
      if (WhichPic == 15) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427277520056877057/c3f83706.jpg"
            } 
          }});
      }
      if (WhichPic == 16) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427283632122494976/2349041-arle.png"
            } 
          }});
      }
      if (WhichPic == 17) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427299037251895297/2349042-draco_centauros.png"
            } 
          }});
      }
      if (WhichPic == 18) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427311039063916544/2354885-rulue.png"
            } 
          }});
      }
      if (WhichPic == 19) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427311719950450688/2374685-ecolo.png"
            } 
          }});
      }
      if (WhichPic == 20) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427313602869854208/unknown.png"
            } 
          }});
      }
      if (WhichPic == 21) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427315303928692755/images.png"
            } 
          }});
      }
      if (WhichPic == 22) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427318698970316800/tumblr_oosbir4YA71w46k7io1_500.png"
            } 
          }});
      }
      if (WhichPic == 23) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427341068531400725/2359295-ringo.png"
            } 
          }});
      }
      if (WhichPic == 24) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427348221170548737/images.png"
            } 
          }});
      }
      if (WhichPic == 25) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            image: {
              url: "https://cdn.discordapp.com/attachments/426999734008283136/427357105918574592/Sig.full.1284841.jpg"
            } 
          }});
      }
      if (WhichPic == 26) {
        message.channel.send({embed: {
            color : parseInt(globals.messageColor),
            title: ("Jess, stop, that's enough")
        }});
    }
    if (WhichPic == 27) {
      message.channel.send({embed: {
          color : parseInt(globals.messageColor),
          title: ('This was a mistake')
      }});
  }
      }

  }


module.exports = PuyoCommand;