'use strict'

const Promise = require('bluebird'),
      winston = require('winston'),
      fs      = Promise.promisifyAll(require('fs')),
      Discord = require('discord.js');

const logPath = 'log/GalacticaBot.log';

/* Bot Constructor */
function Bot() {
  this.config = {  };
  this.actions = {  };
  this.logger = new (winston.Logger) ({
    level: 'debug',
    transports: [
      new (winston.transports.Console),
      //new (winston.transports.File)({ filename: './log/runtime.log' })
    ]
  });

  // Setup Log file
  Promise.bind(this)
  .then(() => {
    if (!fs.existsSync("./"+ logPath)) {
      fs.writeFileSync("./"+ logPath, '', 'utf8', (err) => {
        if (err) console.error(err)
      });
    }
  })
  .then(this.logger.add(winston.transports.File, {filename: `${__dirname}/${logPath}`}))
  // Configurations
  // Reads './config/' and loads .js files in to bot.<filename>
  // Loads in configurations
  .then(this.logger.log('debug', '-*-*-*- Loading bot configuration -*-*-*-'))
  .then(() => {
    return fs.readdirAsync(__dirname + '/config/', 'utf8')
    .map((file) => {
      try {
        let localConfig = require('./config/'+ file);
        if (localConfig.default) { this[file.split('.')[0]] = localConfig.default }
        this.logger.log('debug', 'Loaded configurations for %s', file)
      } catch (e) {
        this.logger.log('debug', "Could not merge config file: "+ file +".\n"+ e.stack);
        return new Error("Could not load config files!");
      }
    })
  })
  // Sets up the Discord API
  .then(function () {
    this.logger.log('debug', '-*-*-*- Loading Discord API -*-*-*-');
    this.discord = new Discord.Client();
    // **** SETUP ACTION HANDLER **** //
    this.discord
      .on('message', (msg) => {
        this.runAction(msg);
      })
      .on('messageUpdate', (oldMsg, newMsg) => {
        if(oldMsg == newMsg || (newMsg.embeds && !oldMsg.embeds) || (newMsg.embeds.length > 0 && oldMsg.embeds.length == 0)) {
           return;
         } else {
           this.runAction(newMsg);
         }
      });
  })
  // Reads './actions/' and loads .js files in to bot.actions
  .then(() => this.logger.log('debug', '-*-*-*- Loading actions -*-*-*-'))
  .return(fs.readdirAsync(__dirname + '/actions/'))
  .map((file) => {
        this.logger.log('debug', 'Loaded action for %s', file)
        try {
          var localAction = require('./actions/'+ file);
          var actions = Object.keys(localAction);
          actions.forEach((a) => {
            this.actions[a] = localAction[a];
            if(this.actions[a].init) {
              this.logger.log('debug', `Initializing action [${this.actions[a].name}]`);
              this.actions[a].init(this);
            }
          });
        } catch (err) {
          this.logger.info('Could not merge action file %s. Check logs for details', file);
          this.logger.error({actionLoadError: err.stack});
       }
  })
  // Logs into server
  .then(function () {
    // **** LOGIN **** //
    if (this.config.login.token) {
      this.discord.login(this.config.login.token);
      this.logger.log('debug', 'Logged into discord server!');
    } else if (this.config.login.email && this.config.login.password) {
      this.discord.login(this.config.login.email, this.config.login.password);
      this.logger.log('debug', 'Logged into discord server!');
    } else {
      this.logger.log('debug', "Login object could not be parsed for login info.");
      return new Error("Could not log into discord server!");
    }
  })
  .then(() => this.logger.info('%s has completed setup and is ready to use!', this.config.name));

  process.on('uncaughtException', (err) => {
    this.logger.error(err);
  });

  process.on('SIGINT', () => {
    this.discord.destroy();
  });
}

const userRegex = /([0-9]+)/;
Bot.prototype.getMember = function(identifier) {
  let userId = identifier.match(userRegex)[0];
  return this.discord.guilds.first().members.get(userId);
};

Bot.prototype.runAction = function(message) {
  let prefix = this.config.actionPrefix;
  if(!message.content.startsWith(prefix) || message.author.this) { return; }
  message.raw = message.content.substr(message.content.indexOf(' ') + 1);

  // Parse for inputs
  const cmdRegex = /"[^"]*"|[\S]*/g;
  let cmdArgs = message.content.match(cmdRegex)
    .map((toke) => { return toke.replace(/"/g, ''); })
    .filter((toke) => { return !!toke; });
  let cmd = cmdArgs.splice(0, 1)[0].replace('!', '');

  if(this.actions[cmd]) {
    if(this.banned && this.banned.includes(`${message.author.username}#${message.author.discriminator}`)) { return; }
    if (this.actions[cmd].admin && message.member.roles.find('name', `${this.config.adminRoleName}`)) {
      try {
        this.actions[cmd].run(cmdArgs, message, this);
      } catch (error) { console.error(error); }
    } else if (!this.actions[cmd].admin) {
      try {
        this.actions[cmd].run(cmdArgs, message, this);
      } catch (error) { console.error(error); }
    } else {
      message.channel.sendMessage(cmd +" can only be run by users with the role "+ this.config.adminRoleName +".");
    }
  } else { message.channel.sendMessage("[" + cmd + "] is not a valid command!"); }
};

module.exports = new Bot();
