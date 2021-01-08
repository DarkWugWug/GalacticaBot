const https = require('https');

exports.test = {
  name: 'test',
  admin: false,
  man: '!test',
  description: 'Does Magik',
  run: (args, msg, bot) => {

  }
}

exports.mastery = {
  name: 'League of Legends - Mastery',
  admin: false,
  man: '!mastery',
  description: 'Get mastery levels for a summoner',
  run: (args, msg, bot) => {
      https.get(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${args[0]}?api_key=${bot.config.apiKeys.league}`, (res) => {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function(chunk){
          body += chunk;
        });
        res.on('end', function(){
          var response = JSON.parse(body)
          bot.logger.debug('Summoner ID Lookup Response:'+ body);
          msg.channel.sendMessage(`Your id is ${response.id}`);
        });
      }).on('error', (e) => {
        bot.logger.error('Summoner ID Lookup Error:'+ e);
      })
  }
}
