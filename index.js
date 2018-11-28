var dotenv = require('dotenv').config();

var Discord = require('discord.js');
var client = new Discord.Client();

client.once('ready', () => {
	console.log('in there');
});

client.on('message', message => {
	console.log(message);
});

client.login(process.env.TOKEN);
