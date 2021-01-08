const _steam = require('steam-web');
const Steam = new _steam({
	apiKey: bot.config.apiKey.steam,
	format: 'json'
});

exports.steam = {
  name: 'steam',
  admin: false,
  man: '!steam match',
  description: 'Finds games that most or all voice chat users own in common on steam.',
  run: (args, msg, bot) => {

    function getSteamGamesOwned(steamid)
    {
    	return new Promise(function(res, rej) {
    		Steam.getOwnedGames({
    			steamid: steamid,
    			include_appinfo: 1,
    			callback: function(err, data) {
    				if(err) { rej(err); }
    				else { res(data); }
    			}
    		});
    	});
    }

    switch(args[0])
		{
			case "match":
				var channel = msg.member.voiceChannel;
				if(!channel) { return msg.channel.sendMessage("You must be in a voice channel for me to match games!"); }

				var players = channel.members.array()
					.filter((member) => { return playerMap[member.user.username]; });
				var users = players.map((member) => { return member.user.username; });

				Promise
					.all(players.map((member) => { return getSteamGamesOwned(playerMap[member.user.username]); }))
					.then((gameResponse) => {
						var gameArrs = gameResponse.map((res) => { return res.response.games.map((gameObj) => { return gameObj.name; }); })

						var intersect = _.intersection(...gameArrs);
						var gameMap = {  }

						for(var i = 0; i < gameArrs.length; i++) {
							var commonPlayers = subarr(users, i, users.length - 1);
							var subintersect = _.intersection(...subarr(gameArrs, i, gameArrs.length - 1));
							gameMap[commonPlayers.join(', ')] = subintersect;
						}

						var msgString = (!intersect || intersect.length == 0) ?
								"You don't all have a game in common. Here are some near matches:\n" :
								"Yins have the following games in common -\n";

						_.forEach(gameMap, (games, group) => { if(games.length > 0) { msgString += '  ' + group + ':\n     - ' + games.join(', ') + '\n'; } });

						msg.channel.sendMessage(msgString);
					});

				break;
		}
  }
}
