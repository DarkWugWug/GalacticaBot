exports.help = {
  name: 'help',
  admin: false,
  man: '!help',
  description: 'Exactly what you\'re looking at',
  run: (args, msg, bot) => {
    var commandString = "**Commands:**\n";
    var adminCommandString = "**Admin commmands** (*"+ bot.config.adminRoleName +"*):\n";
    for (key in bot.actions) {
      var helpString = `\t⦿`;
      helpString += bot.actions[key].man ? `:\t**${bot.actions[key].man}**\n` : '\n';
      if(bot.actions[key].description)
        helpString += `        - ${bot.actions[key].description}\n`;

      if (bot.actions[key].admin) { adminCommandString += helpString; }
      else { commandString += helpString; }
    }
    if (msg.member.roles.exists('name', bot.config.adminRoleName)) {
      msg.channel.sendMessage(commandString +"\n\n"+ adminCommandString);
    } else {
      msg.channel.sendMessage(testingString);
    }
  }
}

exports.identify = {
  name: 'identify',
  admin: false,
  man: '!identify',
  description: 'Identifies a username.',
  run: (args, msg, bot) => {
    if(!args || args.length == 0) { return msg.channel.sendMessage('No valid arguments!'); }
    let user = args[0];
    if(!(user.startsWith('<@') && user.endsWith('>'))) { return msg.channel.sendMessage('[' + user + '] is not a valid user!'); }

    let member = bot.utils.getMember(user);
    if(!member) { return msg.channel.sendMessage('[' + user + '] is not a valid user!'); }

    let msgString;
    if(member.nickname) { msgString = member.nickname + ' (neé ' + member.user.username + '#' + member.user.discriminator + ')'; }
    else { msgString = member.user.username + '#' + member.user.discriminator; }

    msgString += ' is\n';
    msgString += '   Client #' + member.user.id + '\n';

    member.roles.array()
      .filter((role) => { return role.name != '@everyone'; })
      .forEach((role) => { msgString += '   ' + role.name + '\n'; });

    if(isAdmin(member.user)) { msgString += '   and Commander aboard the Galactica'; }


    return msg.channel.sendMessage(msgString);
  }
};
