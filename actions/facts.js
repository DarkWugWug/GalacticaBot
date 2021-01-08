const request = require('superagent');
const S = require('string');

exports.catfact = {
  name: 'catfact',
  admin: false,
  man: '!catfact',
  description: 'Gets a cat fact for you.',
  run: (args, msg, bot) => {
    request
			.get('https://raw.githubusercontent.com/Timidger/Cat-Facts/master/cat_facts.txt')
			.accept('text/plain')
			.end((err, res) => {
				if(err || !res.ok) { return msg.channel.sendMessage("There was an error retrieving your fact :("); }

				var facts = res.text.split('\n');
				var fact = facts[Math.floor(Math.random() * facts.length + 1)];
				msg.channel.sendMessage(fact);
			});
  }
}

exports.dogfact = {
  name: 'dogfact',
  admin: false,
  man: '!dogfact',
  description: 'Gets a dog fact for you.',
  run: (args, msg, bot) => {
    request
			.get('https://www.buzzfeed.com/api/v2/buzz/3491270')
			.accept('application/json')
			.end((err, res) => {
				if(err || !res.ok) { return msg.channel.sendMessage("There was an error retrieving your fact :("); }

				var buzz = res.body.buzz.sub_buzzes[Math.floor(Math.random() * res.body.buzz.sub_buzzes.length + 1)];
				var fact = buzz.header.replace(/<[^>]+>/g, '');
				msg.channel.sendMessage(S(fact).decodeHTMLEntities().s);
			});
  }
}
