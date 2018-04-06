const Discord = require('discord.js');

var client = new Discord.Client();



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
	invite: cmd_invite
}

function cmd_say(msg, args) {
	if ((msg.author.id == msg.guild.ownerID) || (msg.author.id == process.env.owner)) {
		msg.channel.send(args.join(' '));
		msg.delete();
	} else {
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


client.on('message', msg => {
	var cont = msg.content;
	var author = msg.member;
	var channel = msg.channel;
	if (author.id != client.user.id && cont.startsWith(process.env.prefix)) {
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


client.login(process.env.token);
