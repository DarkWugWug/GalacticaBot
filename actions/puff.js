const fs = require('fs');

exports.givePuff = {
  name: 'givePuff',
  admin: false,
  description: 'Gives one puff to any @user',
  man: '!givePuff @AnyUserName',
  init: (bot) => {
    try {
      bot.puffcount = JSON.parse(fs.readFileSync(__dirname + "/../data/puffcount.json", 'utf8')).puffcount;
    } catch(err) { bot.puffcount = {} ; }
    process.on('SIGINT', () => {
      var obj = { puffcount: bot.puffcount }
      fs.writeFileSync(__dirname + '/../data/puffcount.json', JSON.stringify(obj));
    })
  },
  run: function (args, msg, bot) {
    if (args[0]) {
      var userId = args[0].match(/[0-9]+/)[0];
      bot.puffcount[userId] = bot.puffcount[userId] ? bot.puffcount[userId] + 1 : 1
      if (msg.guild.members.get(userId)) { msg.channel.sendMessage('Here ya go ' + args[0] + '! You have ' + bot.puffcount[userId] + ' puff(s). Woohee!'); }
      else { msg.reply('Could not find user!'); }
    } else {
      msg.reply('Couldn\'t parse input. Usage: '+ this.man);
    }
  }
}

exports.removePuff = {
  name: 'removePuff',
  admin: true,
  description: 'Removes one puff from any @user',
  man: '!removePuff @AnyUserName',
  run: (args, msg, bot) => {
    if (args[0]) {
      var userId = args[0].match(/[0-9]+/)[0];
      bot.puffcount[userId] = bot.puffcount[userId] ?
                                bot.puffcount[userId] - 1 < 0 ?
                                  0 : bot.puffcount[userId] - 1 : 0
      if (msg.guild.members.get(userId)) { msg.channel.sendMessage('One less puff for you ' + args[0] + '! You have ' + bot.puffcount[userId] + ' puff(s) now.') ; }
      else { msg.reply('Could not find user!'); }
    } else {
      msg.reply('Couldn\'t parse input. Usage: '+ this.man);
    }
  }
};

exports.totalPuffs = {
  name: 'totalPuffs',
  admin: false,
  description: 'Checks total puffs from any @user',
  man: '!totalPuffs @AnyUserName',
  run: (args, msg, bot) => {
    if (args[0])
    {
      var userId = args[0].match(/[0-9]+/)[0];
      if (msg.guild.members.get(userId) && bot.puffcount[userId])
      {
        msg.channel.sendMessage(args[0] + " has " + bot.puffcount[userId] + " puff(s). Good for you, human!");
      }
      else
      {
        msg.reply('Could not find user or he/she doesn\'t have any puffs Q.Q');
      }
    }
    else
    {
      msg.reply('Couldn\'t parse input. Usage: '+ this.man);
    }
  }
};
