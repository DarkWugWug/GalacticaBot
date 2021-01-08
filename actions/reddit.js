const reddit = require('redwrap');

exports.r = {
  name: 'reddit',
  admin: false,
  man: '!r [Subreddit Name]',
  description: 'Gets a random post from a specified subreddit',
  run: (args, msg, bot) => {
    reddit.r(args[0], function(err, data, res) {
			if(err) { console.error(err); }
			if(!data.data || !data.data.children) { return msg.channel.sendMessage("I fucked up. I'm sorry :("); }
			var list = data.data.children;

			var index = 0, att = 0;
			do {
				index = Math.floor((Math.random() * (list.length - 1)) + 1);
				att++;
			} while(att < list.length && list[index].data.stickied)
			if(att >= list.length) { return msg.channel.sendMessage("An error occured during your request!"); }
			//console.log(JSON.stringify(list[index].data));

			if(list[index].data.over_18 && !list[index].data.selftext && list[index].data.url)
				msg.channel.sendMessage("Link contains NSFW material!\n   /r/" + list[index].data.subreddit + ": \"" + list[index].data.title + "\n   " + list[index].data.url);
			else
				msg.channel.sendMessage("/r/" + list[index].data.subreddit + ": \"" + list[index].data.title + "\"\n" + (list[index].data.selftext ? list[index].data.selftext : list[index].data.url));
		});
  }
}

exports.meanjoke = {
  name: 'meanjoke',
  admin: false,
  man: '!meanjoke',
  description: 'Tells a mean joke!',
  run: (args, msg, bot) => {
    bot.actions.r.run([ 'meanjokes' ], msg, bot);
  }
}
