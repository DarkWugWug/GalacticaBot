const fs = require('fs');

exports.ban = {
  name: 'ban',
  admin: true,
  man: '!ban <user>',
  description: 'Prevents a user from issuing GalacticaBot commands',
  init: (bot) => {
    try {
      bot.banned = JSON.parse(fs.readFileSync(__dirname + "/../data/banlist.json", 'utf8')).banlist;
    } catch(err) { bot.banned = [  ]; }
    process.on('SIGINT', () => {
      var obj = { banlist: bot.banned }
      fs.writeFileSync(__dirname + '/../data/banlist.json', JSON.stringify(obj));
    })
  },
  run: (args, msg, bot) => {
    if(!bot.banned) { bot.banned = [  ]; }
    var member = bot.getMember(args[0]);
    var user = `${member.user.username}#${member.user.discriminator}`;

    if(bot.banned.includes(user)) { return msg.channel.sendMessage(`${user} is already banned!`); }
    bot.banned.push(user);
    msg.channel.sendMessage(`I have banned ${user}!`);
    member.sendMessage("You have been banned from issuing commands to me.\n   If you would like to remmediate this decision, go fuck yourself!");
  }
};

exports.unban = {
  name: 'unban',
  admin: true,
  man: '!unban <user>',
  description: 'Re-allows a user to issue GalacticaBot commands',
  run:  (args, msg, bot) => {
    if(!bot.banned) { bot.banned = [  ]; }
    var member = bot.getMember(args[0]);
    var user = `${member.user.username}#${member.user.discriminator}`;

    if(!bot.banned.includes(user)) { return msg.channel.sendMessage(`${user} is isn't banned!`); }
    bot.banned.splice(bot.banned.indexOf(user), 1);
    msg.channel.sendMessage(`I have unbanned ${user}!`);
    member.sendMessage("You have been granted permission to issue me commands again,\n   do not make me regret this decision");
  }
};

exports.automove = {
  name: 'automove',
  admin: true,
  listen: {
    "voiceStateUpdate": function(bot, oldMember, newMember) {
      if(newMember.mute && newMember.deaf && newMember.voiceChannel && newMember.voiceChannel.name != 'AFK') {
        //console.log(`That bitch ${newMember.user.username} is deaf!`);
        var AFKID = bot.discord.guilds.first().afkChannelID;
        newMember.setVoiceChannel(bot.discord.guilds.first().channels.get(AFKID));
      }
    }
  }
}
