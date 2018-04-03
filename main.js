const Discord = require('discord.js');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var client = new Discord.Client();



client.on('ready', () => {
	console.log('Erfolgreich als ' + client.user.username + ' angemeldet!');
});


var cmdmap = {
	say: cmd_say,
	test: cmd_test,
	technik: cmd_technik,
	en: cmd_en,
	uwmc: cmd_uwmc
}

function cmd_say(msg, args) {
	msg.channel.send(args.join(' '));
	msg.delete();
}

function cmd_test(msg, args) {
	console.log('Dies ist ein Test!');
}

function cmd_technik(msg, args) {
	msg.channel.send('https://minecraft-technik.gamepedia.com/' + args.join('_'));
}

function cmd_en(msg, args) {
	msg.channel.send('https://minecraft.gamepedia.com/' + args.join('_'));
}

function cmd_uwmc(msg, args) {
	msg.channel.send('https://uwmc.de/' + args.join('_'));
}


client.on('message', msg => {
	var cont = msg.content;
	var author = msg.member;
	var channel = msg.channel;
	if (author.id != client.user.id && cont.startsWith(config.prefix)) {
		var invoke = cont.split(' ')[1];
		var args = cont.split(' ').slice(2);
		var space = '';
		if (args.length) space = '_';
		
		console.log(invoke + ' - ' + args);
		if (invoke in cmdmap) {
			cmdmap[invoke](msg, args);
		} else {
			msg.channel.send('https://minecraft-de.gamepedia.com/' + invoke + space + args.join('_'));
		}
	}
});


client.on('voiceStateUpdate', (oldm, newm) => {
	if (oldm.voiceChannelID != newm.voiceChannelID) {
		if (oldm.voiceChannel) {
			if (oldm.guild.roles.find('name', 'Sprachkanal – ' + oldm.voiceChannel.name)) {
				oldm.removeRole(oldm.guild.roles.find('name', 'Sprachkanal – ' + oldm.voiceChannel.name), oldm.displayName + ' hat den Sprach-Kanal "' + oldm.voiceChannel.name + '" verlassen.');
				console.log(oldm.displayName + ' hat den Sprach-Kanal "' + oldm.voiceChannel.name + '" verlassen.');
			}
		}
		if (newm.voiceChannel) {
			if (newm.guild.roles.find('name', 'Sprachkanal – ' + newm.voiceChannel.name)) {
				newm.addRole(newm.guild.roles.find('name', 'Sprachkanal – ' + newm.voiceChannel.name), newm.displayName + ' hat den Sprach-Kanal "' + newm.voiceChannel.name + '" betreten.');
				console.log(newm.displayName + ' hat den Sprach-Kanal "' + newm.voiceChannel.name + '" betreten.');
			}
		}
	}
});


client.login(config.token);
