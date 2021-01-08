exports.roll = {
	name: 'roll',
	admin: false,
	man: '!roll [sides] [number of dice]',
	description: 'Rolls the one or the specified number of n-sided dice',
	run: function(args, msg, bot) {
		var sides = safeParseInt(args[0], 6);
		var num = Math.abs(safeParseInt(args[1], 1));

		var rolls = (new Array(num)).fill(0).map(() => Math.floor(Math.random() * sides + 1) );
		var res = `I rolled ${num}, ${sides}-sided di${num > 1 ? 'ce' : 'e'} and got the following:\n${rolls.join(", ")}`;
		msg.channel.sendMessage(res);
	}
}

function safeParseInt(val, def) {
	var ret = def;

	try { ret = parseInt(val); }
	catch(err) { return def; }

	if(!ret) ret = def;
	return ret;
}
