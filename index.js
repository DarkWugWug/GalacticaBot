var bot = require('./bot');

/*bot.discord.on('voiceStateUpdate', (oldMember, newMember) => {
  if(!newMember.voiceChannelID) { return; }
  if(oldMember.voiceChannelID == newMember.voiceChannelID) { return; }

  //console.log("[ " + newMember.user.username + " ] has entered a channel!");

  var soundFile = newMember.roles.find('name', '@${bot.config.adminRoleName}') ? "media/entrance.aiff" :
          newMember.roles.find('name', '@dunce') ? "media/short_fart.mp3" :
          undefined;
  if(!soundFile) { return; }
  //console.log("Streaming [ " + soundFile + " ]!");

  var same = false;
  if(bot.voiceConnections.size > 0)
    same = bot.voiceConnections.first().channel.equals(newMember.voiceChannel);

  if(same) {
    if(bot.vox.stream) { return; }
    bot.voiceConnections.first().playFile(soundFile);
  } else if(bot.voiceConnections.size == 0) {
    newMember.voiceChannel.join().then((connection) => {
      connection.playFile(soundFile)
        .once("end", () => {
          connection.disconnect();
        });
    });
  }
});*/
