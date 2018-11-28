var dotenv = require('dotenv').config();

var Discord = require('discord.js');
var client = new Discord.Client();

var request = require('request');

client.once('ready', () => {
	console.log('in there');

	var jar = request.jar();
	jar.setCookie(request.cookie(process.env.GDQ_COOKIE), 'https://gamesdonequick.com/');

	var channel = client.channels.get(process.env.DISCORD_CHANNELID_TO_NOTIFY);
	channel.send('hi');

	setInterval(checkSlots, 30000, request, client, jar);
});

client.login(process.env.DISCORD_TOKEN);

var checkSlots = (request, client, jar) => {
	request({ url: 'https://gamesdonequick.com/profile', jar: jar }, (error, response, body) => {
		var $ = require('cheerio').load(body);

		var figures = $($('strong')[0]).text().split(/ \/ /);
		console.log(figures);

		if (parseInt(figures[0]) < parseInt(figures[1])) {
			var users = process.env.DISCORD_USERIDS_TO_NOTIFY.split(/,/);
			var channel = client.channels.get(process.env.DISCORD_CHANNELID_TO_NOTIFY);

			var message = '';

			users.forEach(userId => {
				message += '<@' + userId + '> ';
			});

			channel.send(message + ' looks like there\'s a slot available (' + figures[0] + '/' + figures[1] + '). go go go. https://gamesdonequick.com/profile');
		}
		else if (Math.floor(Math.random() * 120) == 0) {
			var user = client.users.get(process.env.DISCORD_HEARTBEAT_USERID);
			user.send('i\'m still working. (' + figures[0] + '/' + figures[1] + ')');
		}
	});
};
