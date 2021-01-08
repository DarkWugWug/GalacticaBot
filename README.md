# Warning
This project hasn't been actively developed for awhile. The recent upload is not indicative of recent devleopment!

# Galactica Bot
A modular and expandable application to making a Discord bot. The goal of the project is to allow users to create actions (commands to be sent to the bot) and a easy to extend config setup. All while providing a high level customization of server configurations and interaction styles with Discord. This project is licensed the **MIT license**. See: **LICENSE.txt**

# Usage
Set up ```index.js``` as follows:
```javascript
'use strict'

const myBot = require('./bot');

myBot.initialize()
// INITIALIZE PERSONALLY HERE
//.then((myBot) => {})
.then(myBot.login);

```

The ```bot``` object contains all actions, configs, and utility functions as well
as the Discord client. You will need to setup the "actions" and "config" directories
manually at the root level of the project. The actions directory can be empty.
Config must contain a file in it for general setup. Put this there and read on
for more explanation:

```javascript
exports.default = {
  general: {
    version: '0.0.1',
    // Name that the bot will nickname and refer to itself as
    name: 'Galactica Bot',
    // Login details
    login: {
      token: 'change-me!'
      // Alternatively
      // email: 'email@example.com',
      // password: 't3stp@ssw0rd'
    },
    // Sets the symbol, phrase, or word to use to involk actions from chat-room
    actionPrefix: '!',
    // Admin Role (Used to run admin actions)
    adminRoleName: 'Discord Admin'
  }
};
```

#### Config

Adding any javascript (\*.js) file to the ```./config``` directory will allow it
to be parsed into ```bot.config```. The file's export object's top level keys
are used to access that object. Take the file that you've already added to
your ```./config``` directory for example, the field ```name``` can be accessed
through ```bot.config.general.name```. These fields are not sanitized or checked.
Have fun.

#### Actions
An action is defined in the root directory with the file name 'actions'
(```./actions```). To run this directory does not need any files within. Though
if you want to have fun commands to call from the chat-room you'll add the files
here. But first from the chat-room you can call any defined command by saying
while the bot is logged in ```!command-name arg1 arg2```. The bang (!) comes
from the config file at ```general.actionPrefix```. Here's a template action:

```javascript
exports.givePuff = {
  name: 'Give Puff',
  admin: false,
  description: 'Gives one puff to any @user',
  man: '!givePuff @AnyUserName',
  run: function (args, msg, bot) {
    if (args[0]) {
      var userId = args[0].match(/[0-9]+/)[0];
      if (msg.guild.members.get(userId)) { msg.channel.sendMessage('Gave one puff to ' + args[0]); }
      else { msg.channel.sendMessage('Could not find user!'); }
    } else {
      msg.channel.sendMessage('Couldn\'t parse input. Usage: '+ this.man);
    }
  }
}

exports.removePuff = {
  name: 'Remove Puff',
  admin: true,
  description: 'Removes one puff from any @user',
  man: '!removePuff @AnyUserName',
  run: (args, msg, bot) => {
    if (args[0]) {
      var userId = args[0].match(/[0-9]+/)[0];
      if (msg.guild.members.get(userId)) { msg.channel.sendMessage('I\'ve taken one puff from ' + args[0]); }
      else { msg.channel.sendMessage('Could not find user!'); }
    } else {
      msg.channel.sendMessage('Couldn\'t parse input. Usage: '+ this.man);
    }
  }
};
```
The only required field are ```action.admin``` and ```action.run``` to be an
command this bot can use. The admin field determines if that function can be ran
by all users or just those with the role defined under ```bot.config.general.adminRoleName```.
The ```args``` passed to the run function is an array. The contents of it is
the ```msg``` just split on the spaces. The ```msg``` object is just the discord
message object. ```bot``` is the bot we've been talking about the whole time.
