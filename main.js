const Discord = require('discord.js');

var client = new Discord.Client();


var pause = false;


client.on('ready', () => {
	console.log('Erfolgreich als ' + client.user.username + ' angemeldet!');
	client.user.setActivity('Minecraft Wiki');
});


var cmdmap = {
	say: cmd_say,
	test: cmd_test,
	technik: cmd_technik,
	en: cmd_en,
	uwmc: cmd_uwmc,
	invite: cmd_invite,
	search: cmd_search,
	suche: cmd_search,
	stop: cmd_stop,
	pause: cmd_pause
}

function cmd_say(msg, args) {
	if ( msg.author.id == msg.guild.ownerID || msg.author.id == process.env.owner ) {
		msg.channel.send(args.join(' '));
		msg.delete();
	} else if ( !pause ) {
		var space = '';
		if (args.length) space = '_';
		msg.channel.send('https://minecraft-de.gamepedia.com/say' + space + args.join('_'));
	}
}

function cmd_test(msg, args) {
	var x = Math.floor((Math.random() * 10) + 1);
	var text = '';
	switch (x) {
		case 1:
			text = 'ich bin ja schon wach!';
			break;
		case 2:
			text = 'du hast mich gerufen?';
			break;
		case 3:
			text = 'hast du **Kekse** gesagt?';
			break;
		case 4:
			text = 'ja ich funktioniere noch!';
			break;
		case 5:
			text = 'hast du **Kekse** gesagt?';
			break;
		default: 
			text = 'ich bin voll funktionsfähig!';
	}
	msg.reply(text);
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

function cmd_invite(msg, args) {
	if ( args[0].toLowerCase() == 'minecraft' ) {
		msg.reply('hier findest du den offiziellen Minecraft-Discord:\nhttps://discord.gg/minecraft');
	} else {
		msg.reply('du kannst andere Nutzer mit diesem Link einladen:\nhttps://discord.gg/F75vfpd');
	}
}

function cmd_search(msg, args) {
	msg.channel.send('https://minecraft-de.gamepedia.com/Spezial:Suche/' + args.join('_'));
}

function cmd_stop(msg, args) {
	if ( msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		msg.reply('ich schalte mich nun aus!');
		console.log('Ich schalte mich nun aus!');
		client.destroy();
	} else if ( !pause ) {
		var space = '';
		if (args.length) space = '_';
		msg.channel.send('https://minecraft-de.gamepedia.com/stop' + space + args.join('_'));
	}
}

function cmd_pause(msg, args) {
	if ( msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		if ( pause ) {
			msg.reply('ich bin wieder wach!');
			console.log('Ich bin wieder wach!');
			pause = false;
		} else {
			msg.reply('ich lege mich nun schlafen!');
			console.log('Ich lege mich nun schlafen!');
			pause = true;
		}
	} else if ( !pause ) {
		var space = '';
		if (args.length) space = '_';
		msg.channel.send('https://minecraft-de.gamepedia.com/pause' + space + args.join('_'));
	}
}


client.on('message', msg => {
	var cont = msg.content;
	var author = msg.member;
	var channel = msg.channel;
	if ( channel.type == 'text' && author.id != client.user.id && cont.startsWith(process.env.prefix) ) {
		var invoke = cont.split(' ')[1];
		var args = cont.split(' ').slice(2);
		console.log(invoke + ' - ' + args);
		if ( !pause ) {
			if ( invoke in cmdmap ) {
				cmdmap[invoke](msg, args);
			} else {
				var space = '';
				if (args.length) space = '_';
				channel.send('https://minecraft-de.gamepedia.com/' + invoke + space + args.join('_'));
			}
		} else if ( pause && author.id == process.env.owner && ( invoke == "pause" || invoke == "stop" || invoke == "say" ) ) {
			cmdmap[invoke](msg, args);
		}
	}
});


client.on('voiceStateUpdate', (oldm, newm) => {
	if ( oldm.voiceChannelID != newm.voiceChannelID ) {
		if ( oldm.voiceChannel && oldm.guild.roles.find('name', 'Sprachkanal – ' + oldm.voiceChannel.name) ) {
			oldm.removeRole(oldm.guild.roles.find('name', 'Sprachkanal – ' + oldm.voiceChannel.name), oldm.displayName + ' hat den Sprach-Kanal "' + oldm.voiceChannel.name + '" verlassen.');
			console.log(oldm.displayName + ' hat den Sprach-Kanal "' + oldm.voiceChannel.name + '" verlassen.');
		}
		if ( newm.voiceChannel && newm.guild.roles.find('name', 'Sprachkanal – ' + newm.voiceChannel.name) ) {
			newm.addRole(newm.guild.roles.find('name', 'Sprachkanal – ' + newm.voiceChannel.name), newm.displayName + ' hat den Sprach-Kanal "' + newm.voiceChannel.name + '" betreten.');
			console.log(newm.displayName + ' hat den Sprach-Kanal "' + newm.voiceChannel.name + '" betreten.');
		}
	}
});


client.login(process.env.token);
