const ytdl = require('ytdl-core'),
      Promise = require('bluebird');

// Improvements
// * Start time for videos
// * loudness fix to allow bot to be resonable played at 100% in discord
// * Playlist functionality


exports.yt = {
  name: 'yt',
  admin: false,
  description: '',
  man: '!yt [url]\n\
        !yt [next/queue]',
  init: function (bot) {
    bot.youtube = {
      queue: [  ]
    };
  },
  run: function (args, msg, bot) {
    switch (args[0]) {
      case 'skip':
      case 'next':
        bot.logger.debug("Skipping youtube song.");
        bot.discord.voiceConnections.get(msg.guild.id).dispatcher.end();
        break;
      case 'queue':
        var length = new Date(bot.youtube.queue.current.length * 1000).toISOString().substr(11,8);
        let returnMessage = "**Youtube Videos Queued**\n";
        returnMessage += `**Playing** ${bot.youtube.queue.current.title}\t (${length})\n`;
        for (var i = 0; i < bot.youtube.queue.length && i < 14; i++) {
          var lengthQueuedSong = new Date(bot.youtube.queue.current.length * 1000).toISOString().substr(11,8);
          returnMessage += `**${i+1}.** ${bot.youtube.queue[i].title}\t (${lengthQueuedSong})\n`;
        }
        msg.channel.send(returnMessage);
        break;
      default:
        if (args[0]) {
          return new Promise((resolve) => {
            resolve(YouTubeGetID(args[0]));
          }).then((url) => {
            return ytdl.getInfo(url);
          }).then((metadata) => {
            bot.logger.debug(`${metadata.title} added to queue with loudness ${metadata.loudness}.`)
             bot.youtube.queue.push({
              title: metadata.title,
              url: metadata.video_url,
              length: metadata.length_seconds,
              id: metadata.video_id,
              loudness: metadata.loudness
            });
          }).then(() => {
            if(!bot.discord.voiceConnections.get(msg.guild.id)) {
              bot.actions.join.run([], msg, bot)
              .then(connection => {
                bot.youtube.queue.current = bot.youtube.queue.shift();
                return bot.discord.voiceConnections.get(msg.guild.id);
              }).then( voiceConnection => {
                let stream = ytdl(bot.youtube.queue.current.url, { quality: 'highestaudio', filter: 'audioonly' });
                streamYoutube(stream, voiceConnection);
              });
            }
          }).catch(err => { bot.logger.info(`Error playing audio in channel. Error: ${err}`)} );
        } else {
          msg.channel.send('You need to provided a url. Example: \`!yt wuJIqmha2Hk\`');
        }
      }

    function streamYoutube(stream, voiceConnection) {
      voiceConnection.playStream(stream, {volume: 0.15})
      .once("start", () => {bot.logger.debug(`Streaming ${bot.youtube.queue.current.title} to ${voiceConnection.channel.name}`)})
      .once("end", () => {
        stream.destroy();
        bot.logger.debug("Audio.js read end.");
        if(bot.youtube.queue.length > 0) {
          process.nextTick(() => {
            new Promise( (resolve) => {
              bot.youtube.queue.current = bot.youtube.queue.shift();
              resolve (bot.discord.voiceConnections.get(msg.guild.id));
            }).then( voiceConnection => {
              let stream = ytdl(bot.youtube.queue.current.url, { quality: 'highestaudio', filter: 'audioonly' });
              return streamYoutube(stream, voiceConnection);
            });
          });
        } else {
          bot.logger.debug("Queue is empty; disconnecting.");
          stream.destroy();
          bot.youtube.queue = [  ];
          bot.actions.dc.run(args, msg, bot);
        }
      }).on("error", (err) => {
        msg.channel.send(`There was an error streaming to ${voiceConnection.channel.name}`);
        bot.logger.info(`There was an error streaming to ${voiceConnection.channel.name}`, { queue: bot.youtube.queue });
        bot.logger.info("Issuing a disconnect!");
        bot.actions.dc.run(args, msg, bot);
      }).on("disconnect", () => {
        stream.destroy();
        bot.youtube.queue = [  ];
        bot.logger.debug("Audio.js read disconnect event, flushed queue.");
      });
    }

    // https://gist.github.com/takien/4077195
    function YouTubeGetID(url){
      var ID = '';
      url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
      }
      else {
        ID = url;
      }
      return ID;
    }
  }
};
