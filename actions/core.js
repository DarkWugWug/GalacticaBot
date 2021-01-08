/*
  * Will join the channel the author of the message is in or if specified another channel
  * only if (1) the bot is not in another guild channel, (2) the bot is not in
  * the same channel as the user, (3) the bot has permission to join.
*/
exports.join = {
  name: 'join',
  admin: false,
  man: '!join *[Name of Channel]*',
  description: 'Joins the current voice chat you\'re in unless specified.',
  run: (args, msg, bot) => {

    let voices = bot.discord.voiceConnections;
    if(args[0]) {
      let channelName = args.join(' ');
			let guildChannels = msg.member.guild.channels.filter(chan => chan.type == 'voice');
			let channelToJoin = guildChannels.find('name', channelName);
      if (channelToJoin) {
        return joinChannel(channelToJoin, msg);
      } else {
        msg.channel.send(`${msg.author} that channel doesn't exist. Remember the capitalization and spelling must be exact!`)
      }
		} else if(msg.member.voiceChannel) {
      return joinChannel(msg.member.voiceChannel, msg);
		} else {
      msg.channel.send(`Please be in a voice channel when you issue the command.`);
    }

    function joinChannel(channel, msg) {
      if(bot.discord.voiceConnections.get(msg.guild.id)) {
        msg.channel.send(`I'm busy in the ${bot.discord.voiceConnections.get(msg.guild.id).channel.name} channel. Come join me!`)
        if (bot.discord.voiceConnections.get(msg.guild.id).channel.equals(msg.member.voiceChannel)){
          msg.channel.send("Well that's odd... I'm already here!");
        }
      } else {
        return channel.join()
        .then(connection => bot.logger.log('debug', `Joined the ${channel.name} voice channel in ${channel.guild.name}`))
        .catch(err => {
          bot.logger.info(err);
          msg.channel.send(`${msg.author} I cannot join the ${channel.name} channel.`);
        });
        /*if(channel && channel.joinable) {
    			return channel.join()
          .then(connection => bot.logger.log('debug', `Joined the ${channel.name} voice channel in ${channel.guild.name}`))
          .catch(bot.logger.error);
        } else {
          msg.channel.send(`${msg.author} I cannot join the ${channel.name} channel.`);
          return new Error('Cannot join channel');
        }*/
      }
    }
  }
}

/*
  * Disconnects from any voice channel in that guild.
*/
exports.dc = {
  name: 'Disconnect',
  admin: true,
  man: '!dc',
  description: 'Leaves the voice channel.',
  run: (args, msg, bot) => {
    bot.logger.debug(`Disconnected from the ${bot.discord.voiceConnections.get(msg.guild.id).channel.name} channel on ${msg.guild.name}`)
    if (bot.discord.voiceConnections.get(msg.guild.id)) {bot.discord.voiceConnections.get(msg.guild.id).disconnect();}
  }
}
