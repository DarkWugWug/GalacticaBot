const execOS = require('child_process').exec;

exports.js = {
  name: 'js',
  admin: true,
  man: '!js',
  description: 'Executes javascript code.',
  run: (args, msg, bot) => {
    var retMsg = 'An error occured during execution of your code';
		try {
			retMsg = eval(msg.raw);
			if(retMsg instanceof Object) { retMsg = JSON.stringify(retMsg); }
		} catch(err) { console.error(err); }

		return msg.channel.sendMessage(retMsg);
  }
}

exports.exec = {
  name: 'exec',
  admin: true,
  man: '!exec',
  description: 'Executes a command.',
  run: (args, msg, bot) => {
    execOS(msg.raw, { timeout: 5000 }, function(err, stdout, stderr) {
      if(err) {
        console.log(err);
        if(err.killed)
          return msg.channel.sendMessage("Execution of your command timed out!");
        else
          return msg.channel.sendMessage("An error occured trying to execute your command");
      }
      if(stderr) {
        msg.channel.sendMessage("Error:\n" + stderr);
      }

      return msg.channel.sendMessage(stdout);
    });
  }
}
