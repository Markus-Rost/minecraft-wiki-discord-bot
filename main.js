const Discord = require('discord.js');
var request = require('request');

var client = new Discord.Client();


var pause = false;
var english = [
	'447104142729674753',
	'422480985603571712',
	'439427347771293717'
]


client.on('ready', () => {
	console.log('Erfolgreich als ' + client.user.username + ' angemeldet!');
	client.user.setActivity('Minecraft Wiki');
});


var cmdmap = {
	hilfe: cmd_help,
	help: cmd_help,
	befehl: cmd_befehl2,
	command: cmd_befehl2,
	cmd: cmd_befehl2,
	test: cmd_test,
	technik: cmd_technik,
	en: cmd_en,
	uwmc: cmd_uwmc,
	invite: cmd_invite,
	stop: cmd_stop,
	pause: cmd_pause,
	info: cmd_info,
	server: cmd_serverlist,
	say: cmd_multiline,
	delete: cmd_multiline,
	purge: cmd_multiline,
	umfrage: cmd_multiline,
	poll: cmd_multiline,
	fehler: cmd_bug,
	bug: cmd_bug
}

var encmdmap = {
	help: cmd_enhelp,
	command: cmd_befehl2,
	cmd: cmd_befehl2,
	test: cmd_test,
	invite: cmd_invite,
	stop: cmd_stop,
	pause: cmd_pause,
	server: cmd_serverlist,
	say: cmd_multiline,
	delete: cmd_multiline,
	purge: cmd_multiline,
	poll: cmd_multiline,
	bug: cmd_bug
}

var multilinecmdmap = {
	say: cmd_say,
	delete: cmd_delete,
	purge: cmd_delete,
	umfrage: cmd_umfrage,
	poll: cmd_umfrage
}

var pausecmdmap = {
	test: cmd_test,
	stop: cmd_stop,
	pause: cmd_pause,
	server: cmd_serverlist,
	say: cmd_multiline,
	delete: cmd_multiline,
	purge: cmd_multiline
}

function cmd_help(lang, msg, args, line) {
	var cmds = [
		{ cmd: '<Suchbegriff>', desc: 'Ich antworte mit einem Link auf einen passenden Artikel im Minecraft Wiki.', unsearchable: true },
		{ cmd: 'seite <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Minecraft Wiki.' },
		{ cmd: 'page <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Minecraft Wiki.', hide: true },
		{ cmd: 'suche <Suchbegriff>', desc: 'Ich antworte mit einem Link auf die Suchseite zu diesem Begriff im Minecraft Wiki.' },
		{ cmd: 'search <Suchbegriff>', desc: 'Ich antworte mit einem Link auf die Suchseite zu diesem Begriff im Minecraft Wiki.', hide: true },
		{ cmd: '/<Minecraft-Befehl>', desc: 'Ich antworte mit der Syntax des angegebenen Minecraft-Befehls und einem Link auf den Artikel zu diesem Befehl im Minecraft Wiki.', unsearchable: true },
		{ cmd: 'befehl <Minecraft-Befehl>', desc: 'Ich antworte mit der Syntax des angegebenen Minecraft-Befehls und einem Link auf den Artikel zu diesem Befehl im Minecraft Wiki.', hide: true },
		{ cmd: 'command <Minecraft-Befehl>', desc: 'Ich antworte mit der Syntax des angegebenen Minecraft-Befehls und einem Link auf den Artikel zu diesem Befehl im Minecraft Wiki.', hide: true },
		{ cmd: 'cmd <Minecraft-Befehl>', desc: 'Ich antworte mit der Syntax des angegebenen Minecraft-Befehls und einem Link auf den Artikel zu diesem Befehl im Minecraft Wiki.', hide: true },
		{ cmd: 'hilfe', desc: 'Ich liste alle Befehle auf.' },
		{ cmd: 'hilfe <Bot-Befehl>', desc: 'Frage mich, wie ein Befehl funktioniert.' },
		{ cmd: 'hilfe admin', desc: 'Ich liste alle Befehle für Administratoren auf.', admin: true },
		{ cmd: 'hilfe admin emoji', desc: 'Ich liste alle Server-Emoji auf, die ich kenne.', admin: true },
		{ cmd: 'help', desc: 'Ich liste alle Befehle auf.', hide: true },
		{ cmd: 'help <Bot-Befehl>', desc: 'Frage mich, wie ein Befehl funktioniert.', hide: true },
		{ cmd: 'help admin', desc: 'Ich liste alle Befehle für Administratoren auf.', hide: true, admin: true },
		{ cmd: 'help admin emoji', desc: 'Ich liste alle Server-Emoji auf, die ich kenne.', hide: true, admin: true },
		{ cmd: 'technik <Suchbegriff>', desc: 'Ich antworte mit einem Link auf einen passenden Artikel im Technik Wiki.' },
		{ cmd: 'technik seite <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Technik Wiki.', hide: true },
		{ cmd: 'technik suche <Suchbegriff>', desc: 'Ich antworte mit einem Link auf die Suchseite zu diesem Begriff im Technik Wiki.', hide: true },
		{ cmd: 'en <Suchbegriff>', desc: 'Ich antworte mit einem Link auf einen passenden Artikel im englischen Minecraft Wiki.' },
		{ cmd: 'en seite <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im englischen Minecraft Wiki.', hide: true },
		{ cmd: 'en suche <Suchbegriff>', desc: 'Ich antworte mit einem Link auf die Suchseite zu diesem Begriff im englischen Minecraft Wiki.', hide: true },
		{ cmd: '!<Wiki> <Suchbegriff>', desc: 'Ich antworte mit einem Link auf einen passenden Artikel im angegebenen Gamepedia-Wiki: `https://<Wiki>.gamepedia.com/`', unsearchable: true },
		{ cmd: 'Benutzer:<Benutzername>', desc: 'Ich liste ein paar Informationen über den Benutzer auf.', unsearchable: true },
		{ cmd: 'benutzer <Benutzername>', desc: 'Ich liste ein paar Informationen über den Benutzer auf.', hide: true },
		{ cmd: 'benutzerin <Benutzername>', desc: 'Ich liste ein paar Informationen über den Benutzer auf.', hide: true },
		{ cmd: 'user <Benutzername>', desc: 'Ich liste ein paar Informationen über den Benutzer auf.', hide: true },
		{ cmd: 'diff <diff> [<oldid>]', desc: 'Ich verlinke auf die Änderung im Minecraft Wiki.' },
		{ cmd: 'diff <Seitenname>', desc: 'Ich verlinke auf die letzte Änderung an der Seite im Minecraft Wiki.', hide: true },
		{ cmd: 'diff <Seitenname> <diff> [<oldid>]', desc: 'Ich verlinke auf die Änderung an der Seite im Minecraft Wiki.', hide: true },
		{ cmd: 'fehler <Fehler>', desc: 'Ich verlinke auf den Fehler im Bugtracker.' },
		{ cmd: 'bug <Fehler>', desc: 'Ich verlinke auf den Fehler im Bugtracker.', hide: true },
		{ cmd: 'umfrage [<Emoji> <Emoji> ...] <Frage als Freitext>', desc: 'Ich erstelle eine Umfrage und reagiere mit den möglichen Antworten.', admin: true },
		{ cmd: 'poll [<Emoji> <Emoji> ...] <Frage als Freitext>', desc: 'Ich erstelle eine Umfrage und reagiere mit den möglichen Antworten.', hide: true, admin: true },
		{ cmd: 'test', desc: 'Wenn ich gerade aktiv bin, werde ich antworten! Sonst nicht.' },
		{ cmd: 'uwmc <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Unlimitedworld-Forum.' },
		{ cmd: 'invite', desc: 'Ich antworte mit einem Invite-Link für den Server des deutschen Minecraft Wiki.' },
		{ cmd: 'say <Nachricht>', desc: 'Ich schreibe die angegebene Nachricht.', admin: true },
		{ cmd: 'say alarm <Nachricht>', desc: 'Ich schreibe die angegebene Nachricht bereits vorformatiert: 🚨 **<Nachricht>** 🚨', admin: true },
		{ cmd: 'delete <Anzahl>', desc: 'Ich lösche die letzten Nachrichten in dem Kanal, solange sie nicht älter als 14 Tage sind.', admin: true },
		{ cmd: 'purge <Anzahl>', desc: 'Ich lösche die letzten Nachrichten in dem Kanal, solange sie nicht älter als 14 Tage sind.', hide: true, admin: true },
		{ cmd: 'info', desc: 'Du wirst bei neuen Entwicklungsversionen auf dem Server des deutschen Minecraft Wiki erwähnt.' }
	]
	
	if ( args.length ) {
		if ( args[0].toLowerCase() == 'admin' && ( msg.channel.type != 'text' || msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
			if ( args[1] && args[1].toLowerCase() == 'emoji' ) {
				var cmdlist = 'Dies sind alle Server-Emoji, die ich nutzen kann:\n';
				var emojis = client.emojis;
				var i = 0;
				emojis.forEach( function(emoji) {
					var br = '\t\t';
					if ( i % 2 ) br = '\n';
					cmdlist += emoji.toString() + '`' + emoji.toString().replace(emoji.name + ':', '') + '`' + br;
					i++;
				} );
				msg.channel.send(cmdlist, {split:true});
			}
			else {
				var cmdlist = 'Diese Befehle können nur Administratoren ausführen:\n';
				for ( var i = 0; i < cmds.length; i++ ) {
					if ( cmds[i].admin && !cmds[i].hide ) {
						cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
					}
				}
				
				msg.channel.send(cmdlist);
			}
		}
		else {
			var cmdlist = ''
			for ( var i = 0; i < cmds.length; i++ ) {
				if ( cmds[i].cmd.split(' ')[0] === args[0].toLowerCase() && !cmds[i].unsearchable && ( msg.channel.type != 'text' || !cmds[i].admin || msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
					cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
				}
			}
			
			if ( cmdlist == '' ) msg.react('❓');
			else msg.channel.send(cmdlist);
		}
	}
	else {
		var cmdlist = 'Du willst also wissen, was ich so drauf habe? Hier ist eine Liste aller Befehle, die ich verstehe:\n';
		for ( var i = 0; i < cmds.length; i++ ) {
			if ( !cmds[i].hide && !cmds[i].admin ) {
				cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
			}
		}
		
		msg.channel.send(cmdlist);
	}
}

function cmd_enhelp(lang, msg, args, line) {
	var cmds = [
		{ cmd: '<search term>', desc: 'I will answer with a link to a matching article in the Minecraft Wiki.', unsearchable: true },
		{ cmd: 'page <page name>', desc: 'I will answer with a link to the article in the Minecraft Wiki.' },
		{ cmd: 'search <search term>', desc: 'I will answer with a link to the search page for the article in the Minecraft Wiki.' },
		{ cmd: '/<Minecraft command>', desc: 'I will answer with the syntax of the Minecraft command and a link to the article for the command in the Minecraft Wiki.', unsearchable: true },
		{ cmd: 'command <Minecraft command>', desc: 'I will answer with the syntax of the Minecraft command and a link to the article for the command in the Minecraft Wiki.', hide: true },
		{ cmd: 'cmd <Minecraft command>', desc: 'I will answer with the syntax of the Minecraft command and a link to the article for the command in the Minecraft Wiki.', hide: true },
		{ cmd: 'User:<username>', desc: 'I will show some information about the user.', unsearchable: true },
		{ cmd: 'user <username>', desc: 'I will show some information about the user.', hide: true },
		{ cmd: 'diff <diff> [<oldid>]', desc: 'I will answer with a link to the diff in the Minecraft Wiki.' },
		{ cmd: 'diff <page name>', desc: 'I will answer with a link to the last diff on the article in the Minecraft Wiki.', hide: true },
		{ cmd: 'diff <page name> <diff> [<oldid>]', desc: 'I will answer with a link to the diff on the article in the Minecraft Wiki.', hide: true },
		{ cmd: 'bug <bug>', desc: 'I will answer with a link to the bug in the bug tracker.' },
		{ cmd: 'help', desc: 'I will list all the commands that I understand.' },
		{ cmd: 'help <bot command>', desc: 'Wonder how a command works? Let me explain it to you!' },
		{ cmd: 'help admin', desc: 'I will list all administrator commands.', admin: true },
		{ cmd: 'help admin emoji', desc: 'I will list all server emoji that I can use.', admin: true },
		{ cmd: '!<wiki> <search term>', desc: 'I will answer with a link to a matching article in the named Gamepedia wiki: `https://<wiki>.gamepedia.com/`', unsearchable: true },
		{ cmd: 'poll [<emoji> <emoji> ...] <question as free text>', desc: 'I will create a poll and react with the possible answers.', admin: true },
		{ cmd: 'test', desc: 'If I\'m active, I\'ll answer! Otherwise not.' },
		{ cmd: 'invite', desc: 'I will send an invite link for the Minecraft Wiki Discord server.' },
		{ cmd: 'say <message>', desc: 'I will write the given message.', admin: true },
		{ cmd: 'say alarm <message>', desc: 'I will write the given message already preformatted: 🚨 **<message>** 🚨', admin: true },
		{ cmd: 'delete <count>', desc: 'I will delete the recent messages in the channel, as long as they aren\'t older than 14 days.', admin: true },
		{ cmd: 'purge <count>', desc: 'I will delete the recent messages in the channel, as long as they aren\'t older than 14 days.', hide: true, admin: true }
	]
	
	if ( args.length ) {
		if ( args[0].toLowerCase() == 'admin' && ( msg.channel.type != 'text' || msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
			if ( args[1] && args[1].toLowerCase() == 'emoji' ) {
				var cmdlist = 'These are all the server emoji I can use:\n';
				var emojis = client.emojis;
				var i = 0;
				emojis.forEach( function(emoji) {
					var br = '\t\t';
					if ( i % 2 ) br = '\n';
					cmdlist += emoji.toString() + '`' + emoji.toString().replace(emoji.name + ':', '') + '`' + br;
					i++;
				} );
				msg.channel.send(cmdlist, {split:true});
			}
			else {
				var cmdlist = 'These commands can only be performed by administrators:\n';
				for ( var i = 0; i < cmds.length; i++ ) {
					if ( cmds[i].admin && !cmds[i].hide ) {
						cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
					}
				}
				
				msg.channel.send(cmdlist);
			}
		}
		else {
			var cmdlist = ''
			for ( var i = 0; i < cmds.length; i++ ) {
				if ( cmds[i].cmd.split(' ')[0] === args[0].toLowerCase() && !cmds[i].unsearchable && ( msg.channel.type != 'text' || !cmds[i].admin || msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
					cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
				}
			}
			
			if ( cmdlist == '' ) msg.react('❓');
			else msg.channel.send(cmdlist);
		}
	}
	else {
		var cmdlist = 'So, you want to know what things I can do? Here is a list of all commands that I understand:\n';
		for ( var i = 0; i < cmds.length; i++ ) {
			if ( !cmds[i].hide && !cmds[i].admin ) {
				cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
			}
		}
		
		msg.channel.send(cmdlist);
	}
}

function cmd_say(lang, msg, args, line) {
	if ( msg.channel.type == 'text' && ( msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
		args = emoji(args);
		if ( args[0] == 'alarm' ) {
			msg.channel.send('🚨 **' + args.slice(1).join(' ') + '** 🚨');
		} else {
			msg.channel.send(args.join(' '));
		}
		msg.delete();
	} else {
		msg.react('❌');
	}
}

function cmd_test(lang, msg, args, line) {
	if ( !pause ) {
		var text = '';
		if ( lang ) {
			var x = Math.floor((Math.random() * 10) + 1);
			switch (x) {
				case 1:
					text = 'I\'m still alive!';
					break;
				case 2:
					text = 'and believe me, I am still alive.';
					break;
				case 3:
					text = 'I\'m doing science and I\'m still alive.';
					break;
				case 4:
					text = 'I feel fantastic and I\'m still alive.';
					break;
				default: 
					text = 'I\'m fully functional!';
			}
		}
		else {
			var x = Math.floor((Math.random() * 10) + 1);
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
					text = 'ja, ich funktioniere noch!';
					break;
				case 5:
					text = 'hast du **Kekse** gesagt?';
					break;
				default: 
					text = 'ich bin voll funktionsfähig!';
			}
		}
		msg.reply(text);
		console.log('Dies ist ein Test: Voll funktionsfähig!');
	} else {
		if ( lang ) msg.reply('I\'m currently inactive.');
		else msg.reply('ich mache gerade eine Pause.');
		console.log('Dies ist ein Test: Pausiert!');
	}
}

function cmd_technik(lang, msg, args, line) {
	if ( !args.length ) {
		msg.channel.send( 'https://minecraft-technik.gamepedia.com/Technik_Wiki' );
	}
	else {
		if ( args[0].toLowerCase().startsWith('wiki') ) {
			var title = 'Technik_' + args.join('_');
		} else {
			var title = args.join('_');
		}
		
		cmd_link(lang, msg, title, 'minecraft-technik', 'technik ');
	}
}

function cmd_en(lang, msg, args, line) {
	cmd_link(lang, msg, args.join('_'), 'minecraft', 'en ');
}

function cmd_uwmc(lang, msg, args, line) {
	msg.channel.send('https://uwmc.de/' + args.join('-'));
}

function cmd_invite(lang, msg, args, line) {
	if ( lang ) {
		if ( args.length && args[0].toLowerCase() == 'minecraft' ) {
			msg.reply('you can join the official Minecraft Discord by clicking this link:\nhttps://discord.gg/minecraft');
		} else if ( args.length && args[0].toLowerCase() == '<@' + client.user.id + '>' ) {
			client.generateInvite(268954689).then( invite => msg.reply('use this link to invite me to another server:\n<' + invite + '>') );
		} else {
			msg.reply('use this link to invite other users to this server:\nhttps://discord.gg/fGdE5ZE');
		}
	} else {
		if ( args.length && args[0].toLowerCase() == 'minecraft' ) {
			msg.reply('hier findest du den offiziellen Minecraft-Discord:\nhttps://discord.gg/minecraft');
		} else if ( args.length && args[0].toLowerCase() == '<@' + client.user.id + '>' ) {
			client.generateInvite(268954689).then( invite => msg.reply('du kannst mich mit diesem Link auf einen anderen Server einladen:\n<' + invite + '>') );
		} else {
			msg.reply('du kannst andere Nutzer mit diesem Link einladen:\nhttps://discord.gg/F75vfpd');
		}
	}
}

function cmd_stop(lang, msg, args, line) {
	if ( msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		msg.reply('ich schalte mich nun aus!');
		console.log('Ich schalte mich nun aus!');
		client.destroy();
	} else if ( !pause ) {
		cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft' + (lang ? '' : '-de'), '');
	}
}

function cmd_pause(lang, msg, args, line) {
	if ( msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		if ( pause ) {
			msg.reply('ich bin wieder wach!');
			console.log('Ich bin wieder wach!');
			pause = false;
			client.user.setStatus('online');
		} else {
			msg.reply('ich lege mich nun schlafen!');
			console.log('Ich lege mich nun schlafen!');
			pause = true;
			client.user.setStatus('invisible');
		}
	} else if ( !pause ) {
		cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft' + (lang ? '' : '-de'), '');
	}
}

var befehle = {
	'advancement':		[
					'/advancement grant <Selektor> everything',
					'/advancement grant <Selektor> from <Fortschritt>',
					'/advancement grant <Selektor> only <Fortschritt>',
					'/advancement grant <Selektor> only <Fortschritt> <Kriterium>',
					'/advancement grant <Selektor> through <Fortschritt>',
					'/advancement grant <Selektor> until <Fortschritt>',
					'/advancement revoke <Selektor> everything',
					'/advancement revoke <Selektor> from <Fortschritt>',
					'/advancement revoke <Selektor> only <Fortschritt>',
					'/advancement revoke <Selektor> only <Fortschritt> <Kriterium>',
					'/advancement revoke <Selektor> through <Fortschritt>',
					'/advancement revoke <Selektor> until <Fortschritt>'
				],
	'ban':			[
					'/ban <Selektor>',
					'/ban <Selektor> <Grund>'
				],
	'ban-ip':		[
					'/ban-ip <Selektor>',
					'/ban-ip <Selektor> <Grund>'
				],
	'banlist':		[
					'/banlist',
					'/banlist ips',
					'/banlist players'
				],
	'bossbar':		[
					'/bossbar add <Name> <Beschriftung>',
					'/bossbar get <Name> max',
					'/bossbar get <Name> players',
					'/bossbar get <Name> value',
					'/bossbar get <Name> visible',
					'/bossbar list',
					'/bossbar remove <Name>',
					'/bossbar set <Name> color <Farbe>',
					'/bossbar set <Name> max <MaxMenge>',
					'/bossbar set <Name> name <Beschriftung>',
					'/bossbar set <Name> players',
					'/bossbar set <Name> players <Selektor>',
					'/bossbar set <Name> style <Stil>',
					'/bossbar set <Name> value <Wert>',
					'/bossbar set <Name> visible <Sichtbarkeit>'
				],
	'clear':		[
					'/clear',
					'/clear <Selektor>',
					'/clear <Selektor> <Gegenstand>',
					'/clear <Selektor> <Gegenstand> <MaxMenge>'
				],
	'clone':		[
					'/clone <Position1> <Position2> <Ziel-Position>',
					'/clone <Position1> <Position2> <Ziel-Position> filtered <Filterblock>',
					'/clone <Position1> <Position2> <Ziel-Position> filtered <Filterblock> <Platzierung>',
					'/clone <Position1> <Position2> <Ziel-Position> masked',
					'/clone <Position1> <Position2> <Ziel-Position> masked <Platzierung>',
					'/clone <Position1> <Position2> <Ziel-Position> replace',
					'/clone <Position1> <Position2> <Ziel-Position> replace <Platzierung>'
				],
	'data':			[
					'/data get block <Position>',
					'/data get block <Position> <Pfad>',
					'/data get block <Position> <Pfad> <Skalierung>',
					'/data get entity <Selektor>',
					'/data get entity <Selektor> <Pfad>',
					'/data get entity <Selektor> <Pfad> <Skalierung>',
					'/data merge block <Position> <NBT-Daten>',
					'/data merge entity <Selektor> <NBT-Daten>',
					'/data remove block <Position> <Pfad>',
					'/data remove entity <Selektor> <Pfad>'
				],
	'datapack':		[
					'/datapack disable <Datenpaket>',
					'/datapack enable <Datenpaket>',
					'/datapack enable <Datenpaket> after <Datenpaket bereits aktiviert>',
					'/datapack enable <Datenpaket> before <Datenpaket bereits aktiviert>',
					'/datapack enable <Datenpaket> first',
					'/datapack enable <Datenpaket> last',
					'/datapack list',
					'/datapack list available',
					'/datapack list enabled'
				],
	'debug':		[
					'/debug start',
					'/debug stop'
				],
	'defaultgamemode':	[
					'/defaultgamemode adventure',
					'/defaultgamemode creative',
					'/defaultgamemode spectator',
					'/defaultgamemode survival'
				],
	'deop':			[
					'/deop <Selektor>'
				],
	'difficulty':		[
					'/difficulty',
					'/difficulty easy',
					'/difficulty hard',
					'/difficulty normal',
					'/difficulty peaceful'
				],
	'effect':		[
					'/effect clear <Selektor>',
					'/effect clear <Selektor> <Effekt-ID>',
					'/effect give <Selektor> <Effekt-ID>',
					'/effect give <Selektor> <Effekt-ID> <Zeit in Sekunden>',
					'/effect give <Selektor> <Effekt-ID> <Zeit in Sekunden> <Verstärkung>',
					'/effect give <Selektor> <Effekt-ID> <Zeit in Sekunden> <Verstärkung> <Partikelunsichtbarkeit>'
				],
	'enchant':		[
					'/enchant <Selektor> <Verzauberungs-ID>',
					'/enchant <Selektor> <Verzauberungs-ID> <Stufe>'
				],
	'execute':		[
					'/execute < Unterbefehl >',
					'\nUnterbefehle:\n=============',
					'run <Befehl>',
					'align <Achsen> < Unterbefehl >',
					'anchored eyes < Unterbefehl >',
					'anchored feet < Unterbefehl >',
					'as <Selektor> < Unterbefehl >',
					'at <Selektor> < Unterbefehl >',
					'facing entity <Selektor> eyes < Unterbefehl >',
					'facing entity <Selektor> feet < Unterbefehl >',
					'facing <Position> < Unterbefehl >',
					'if block <Position> <Block> < Unterbefehl >',
					'if blocks <Position1> <Position2> <Ziel-Position> all < Unterbefehl >',
					'if blocks <Position1> <Position2> <Ziel-Position> masked < Unterbefehl >',
					'if entity <Selektor> < Unterbefehl >',
					'if score <Selektor> <Ziel> <Operation> <Selektor> <Ziel> < Unterbefehl >',
					'if score <Selektor> <Ziel> matches <Punktebereich> < Unterbefehl >',
					'unless block <Position> <Block> < Unterbefehl >',
					'unless blocks <Position1> <Position2> <Ziel-Position> all < Unterbefehl >',
					'unless blocks <Position1> <Position2> <Ziel-Position> masked < Unterbefehl >',
					'unless entity <Selektor> < Unterbefehl >',
					'unless score <Selektor> <Ziel> <Operator> <Selektor> <Ziel> < Unterbefehl >',
					'unless score <Selektor> <Ziel> matches <Punktebereich> < Unterbefehl >',
					'in <Dimension> < Unterbefehl >',
					'positioned as <Selektor> < Unterbefehl >',
					'positioned <Position> < Unterbefehl >',
					'rotated as <Selektor> < Unterbefehl >',
					'rotated <Rotation> < Unterbefehl >',
					'store result block <Position> <Pfad> <Datentyp> <Skalierung> < Unterbefehl >',
					'store result bossbar <Name> max < Unterbefehl >',
					'store result bossbar <Name> value < Unterbefehl >',
					'store result entity <Selektor> <Pfad> <Datentyp> <Skalierung> < Unterbefehl >',
					'store result score <Selektor> <Ziel> < Unterbefehl >',
					'store success block <Position> <Pfad> <Datentyp> <Skalierung> < Unterbefehl >',
					'store success bossbar <Name> max < Unterbefehl >',
					'store success bossbar <Name> value < Unterbefehl >',
					'store success entity <Selektor> <Pfad> <Datentyp> <Skalierung> < Unterbefehl >',
					'store success score <Selektor> <Ziel> < Unterbefehl >'
				],
	'experience':		[
					'/experience add <Selektor> <Menge>',
					'/experience add <Selektor> <Menge> levels',
					'/experience add <Selektor> <Menge> points',
					'/experience query <Selektor> levels',
					'/experience query <Selektor> points',
					'/experience set <Selektor> <Menge>',
					'/experience set <Selektor> <Menge> levels',
					'/experience set <Selektor> <Menge> points'
				],
	'fill':			[
					'/fill <Position1> <Position2> <Block>',
					'/fill <Position1> <Position2> <Block> destroy',
					'/fill <Position1> <Position2> <Block> hollow',
					'/fill <Position1> <Position2> <Block> keep',
					'/fill <Position1> <Position2> <Block> outline',
					'/fill <Position1> <Position2> <Block> replace',
					'/fill <Position1> <Position2> <Block> replace <Filterblock>'
				],
	'function':		[
					'/function <Funktion>'
				],
	'gamemode':		[
					'/gamemode adventure',
					'/gamemode adventure <Selektor>',
					'/gamemode creative',
					'/gamemode creative <Selektor>',
					'/gamemode spectator',
					'/gamemode spectator <Selektor>',
					'/gamemode survival',
					'/gamemode survival <Selektor>'
				],
	'gamerule':		[
					'/gamerule <Regel>',
					'/gamerule <Regel> <Wert>'
				],
	'give':			[
					'/give <Selektor> <Gegenstand>',
					'/give <Selektor> <Gegenstand> <Anzahl>'
				],
	'help':			[
					'/help',
					'/help <Befehl>'
				],
	'kick':			[
					'/kick <Selektor>',
					'/kick <Selektor> <Grund>'
				],
	'kill':			[
					'/kill <Selektor>'
				],
	'list':			[
					'/list',
					'/list uuids'
				],
	'locate':		[
					'/locate <Bauwerk>'
				],
	'me':			[
					'/me <Aktion>'
				],
	'msg':			[
					'/msg <Selektor> <Nachricht>'
				],
	'op':			[
					'/op <Selektor>'
				],
	'pardon':		[
					'/pardon <Selektor>'
				],
	'pardon-ip':		[
					'/pardon-ip <IP-Adresse>'
				],
	'particle':		[
					'/particle <Partikel-ID>',
					'/particle <Partikel-ID> <Position> <Ausdehnung> <Geschwindigkeit> <Anzahl>',
					'/particle <Partikel-ID> <Position> <Ausdehnung> <Geschwindigkeit> <Anzahl> force',
					'/particle <Partikel-ID> <Position> <Ausdehnung> <Geschwindigkeit> <Anzahl> force <Selektor>',
					'/particle <Partikel-ID> <Position> <Ausdehnung> <Geschwindigkeit> <Anzahl> normal',
					'/particle <Partikel-ID> <Position> <Ausdehnung> <Geschwindigkeit> <Anzahl> normal <Selektor>'
				],
	'playsound':		[
					'/playsound <Geräusch> <Geräuschart> <Selektor>',
					'/playsound <Geräusch> <Geräuschart> <Selektor> <Position>',
					'/playsound <Geräusch> <Geräuschart> <Selektor> <Position> <Lautstärke>',
					'/playsound <Geräusch> <Geräuschart> <Selektor> <Position> <Lautstärke> <Tonhöhe>',
					'/playsound <Geräusch> <Geräuschart> <Selektor> <Position> <Lautstärke> <Tonhöhe> <Mindestlautstärke>'
				],
	'publish':		[
					'/publish',
					'/publish <Port>'
				],
	'recipe':		[
					'/recipe give <Selektor> *',
					'/recipe give <Selektor> <Rezept>',
					'/recipe take <Selektor> *',
					'/recipe take <Selektor> <Rezept>'
				],
	'reload':		[
					'/reload'
				],
	'replaceitem':		[
					'/replaceitem block <Position> <Slot> <Gegenstand>',
					'/replaceitem block <Position> <Slot> <Gegenstand> <Anzahl>',
					'/replaceitem entity <Selektor> <Slot> <Gegenstand>',
					'/replaceitem entity <Selektor> <Slot> <Gegenstand> <Anzahl>'
				],
	'save-all':		[
					'/save-all',
					'/save-all flush'
				],
	'save-off':		[
					'/save-off'
				],
	'save-on':		[
					'/save-on'
				],
	'say':			[
					'/say <Nachricht>'
				],
	'scoreboard':		[
					'/scoreboard objectives add <Ziel> <Kriterientyp>',
					'/scoreboard objectives add <Ziel> <Kriterientyp> <Anzeigename>',
					'/scoreboard objectives list',
					'/scoreboard objectives remove <Ziel>',
					'/scoreboard objectives setdisplay <Anzeigeposition>',
					'/scoreboard objectives setdisplay <Anzeigeposition> <Ziel>',
					'/scoreboard players add <Selektor> <Ziel> <Punkte>',
					'/scoreboard players enable <Selektor> <Ziel>',
					'/scoreboard players get <Selektor> <Ziel>',
					'/scoreboard players list',
					'/scoreboard players list <Selektor>',
					'/scoreboard players operation <Selektor> <Ziel> <Operation> <Selektor> <Ziel>',
					'/scoreboard players remove <Selektor> <Ziel> <Punkte>',
					'/scoreboard players reset <Selektor>',
					'/scoreboard players reset <Selektor> <Ziel>',
					'/scoreboard players set <Selektor> <Ziel> <Punkte>'
				],
	'seed':			[
					'/seed'
				],
	'setblock':		[
					'/setblock <Position> <Block>',
					'/setblock <Position> <Block> <Platzierung>'
				],
	'setidletimeout':	[
					'/setidletimeout <Zeit in Sekunden>'
				],
	'setworldspawn':	[
					'/setworldspawn',
					'/setworldspawn <Position>'
				],
	'spawnpoint':		[
					'/spawnpoint',
					'/spawnpoint <Selektor>',
					'/spawnpoint <Selektor> <Position>'
				],
	'spreadplayers':	[
					'/spreadplayers <Position ohne Y-Koordinate> <Abstand> <Bereich> <Teamverteilung> <Selektor>'
				],
	'stop':			[
					'/stop'
				],
	'stopsound':		[
					'/stopsound <Selektor>',
					'/stopsound <Selektor> <Geräuschart>',
					'/stopsound <Selektor> <Geräuschart> <Geräusch>'
				],
	'summon':		[
					'/summon <Objekt>',
					'/summon <Objekt> <Position>',
					'/summon <Objekt> <Position> <NBT-Daten>'
				],
	'tag':			[
					'/tag <Selektor> add <Name des Etikett>',
					'/tag <Selektor> list',
					'/tag <Selektor> remove <Name des Etikett>'
				],
	'team':			[
					'/team add <Teamname>',
					'/team add <Teamname> <Anzeigename>',
					'/team empty <Teamname>',
					'/team join <Teamname>',
					'/team join <Teamname> <Selektor>',
					'/team leave <Selektor>',
					'/team list',
					'/team list <Teamname>',
					'/team option <Teamname> <Eigenschaft> <Wert>',
					'/team remove <Teamname>'
				],
	'teleport':		[
					'/teleport <Ziel-Selektor>',
					'/teleport <Ziel-Position>',
					'/teleport <Selektor> <Ziel-Selektor>',
					'/teleport <Selektor> <Ziel-Position>',
					'/teleport <Selektor> <Ziel-Position> <Drehung> <Kopfneigung>',
					'/teleport <Selektor> <Ziel-Position> facing <Position>',
					'/teleport <Selektor> <Ziel-Position> facing entity <Selektor> eyes',
					'/teleport <Selektor> <Ziel-Position> facing entity <Selektor> feet'
				],
	'tellraw':		[
					'/tellraw <Selektor> <Nachricht im JSON-Format>'
				],
	'tickingarea':		[
					'/* Diesen Befehl gibt es nur in der Bedrock Edition */',
					'/tickingarea add <von: x y z> <bis: x y z>',
					'/tickingarea add <von: x y z> <bis: x y z> <Name: String>',
					'/tickingarea add circle <Zentrum: x y z> <Radius: int>',
					'/tickingarea add circle <Zentrum: x y z> <Radius: int> <Name: String>',
					'/tickingarea remove <Name: String>',
					'/tickingarea remove <Position: x y z>',
					'/tickingarea remove_all',
					'/tickingarea list',
					'/tickingarea list all-dimensions'
				],
	'time':			[
					'/time add <Zeit>',
					'/time query day',
					'/time query daytime',
					'/time query gametime',
					'/time set day',
					'/time set midnight',
					'/time set night',
					'/time set noon',
					'/time set <Zeit>'
				],
	'title':		[
					'/title <Selektor> actionbar <Titel im JSON-Format>',
					'/title <Selektor> clear',
					'/title <Selektor> reset',
					'/title <Selektor> subtitle <Titel im JSON-Format>',
					'/title <Selektor> times <Einblendezeit in Ticks> <Anzeigezeit in Ticks> <Ausblendezeit in Ticks>',
					'/title <Selektor> title <Titel im JSON-Format>'
				],
	'trigger':		[
					'/trigger <Auslöser>',
					'/trigger <Auslöser> add <Wert>',
					'/trigger <Auslöser> set <Wert>'
				],
	'weather':		[
					'/weather clear',
					'/weather clear <Dauer in Sekunden>',
					'/weather rain',
					'/weather rain <Dauer in Sekunden>',
					'/weather thunder',
					'/weather thunder <Dauer in Sekunden>'
				],
	'whitelist':		[
					'/whitelist add <Selektor>',
					'/whitelist list',
					'/whitelist off',
					'/whitelist on',
					'/whitelist reload',
					'/whitelist remove <Selektor>'
				],
	'worldborder':		[
					'/worldborder add <Weite>',
					'/worldborder add <Weite> <Zeit in Sekunden>',
					'/worldborder center <Position ohne Y-Koordinate>',
					'/worldborder damage amount <Schaden pro Block>',
					'/worldborder damage buffer <Weite>',
					'/worldborder get',
					'/worldborder set <Weite>',
					'/worldborder set <Weite> <Zeit in Sekunden>',
					'/worldborder warning distance <Weite>',
					'/worldborder warning time <Zeit in Sekunden>'
				]
}

var enbefehle = {
	'advancement':		[
					'/advancement grant <targets> everything',
					'/advancement grant <targets> from <advancement>',
					'/advancement grant <targets> only <advancement>',
					'/advancement grant <targets> only <advancement> <criterion>',
					'/advancement grant <targets> through <advancement>',
					'/advancement grant <targets> until <advancement>',
					'/advancement revoke <targets> everything',
					'/advancement revoke <targets> from <advancement>',
					'/advancement revoke <targets> only <advancement>',
					'/advancement revoke <targets> only <advancement> <criterion>',
					'/advancement revoke <targets> through <advancement>',
					'/advancement revoke <targets> until <advancement>'
				],
	'ban':			[
					'/ban <targets>',
					'/ban <targets> <reason>'
				],
	'ban-ip':		[
					'/ban-ip <target>',
					'/ban-ip <target> <reason>'
				],
	'banlist':		[
					'/banlist',
					'/banlist ips',
					'/banlist players'
				],
	'bossbar':		[
					'/bossbar add <id> <name>',
					'/bossbar get <id> max',
					'/bossbar get <id> players',
					'/bossbar get <id> value',
					'/bossbar get <id> visible',
					'/bossbar list',
					'/bossbar remove <id>',
					'/bossbar set <id> color <color>',
					'/bossbar set <id> max <max>',
					'/bossbar set <id> name <name>',
					'/bossbar set <id> players',
					'/bossbar set <id> players <targets>',
					'/bossbar set <id> style <style>',
					'/bossbar set <id> value <value>',
					'/bossbar set <id> visible <visible>'
				],
	'clear':		[
					'/clear',
					'/clear <targets>',
					'/clear <targets> <item>',
					'/clear <targets> <item> <maxCount>'
				],
	'clone':		[
					'/clone <begin> <end> <destination>',
					'/clone <begin> <end> <destination> filtered <filter>',
					'/clone <begin> <end> <destination> filtered <filter> <mode>',
					'/clone <begin> <end> <destination> masked',
					'/clone <begin> <end> <destination> masked <mode>',
					'/clone <begin> <end> <destination> replace',
					'/clone <begin> <end> <destination> replace <mode>'
				],
	'data':			[
					'/data get block <pos>',
					'/data get block <pos> <path>',
					'/data get block <pos> <path> <scale>',
					'/data get entity <target>',
					'/data get entity <target> <path>',
					'/data get entity <target> <path> <scale>',
					'/data merge block <pos> <nbt>',
					'/data merge entity <target> <nbt>',
					'/data remove block <pos> <path>',
					'/data remove entity <target> <path>'
				],
	'datapack':		[
					'/datapack disable <name>',
					'/datapack enable <name>',
					'/datapack enable <name> after <existing>',
					'/datapack enable <name> before <existing>',
					'/datapack enable <name> first',
					'/datapack enable <name> last',
					'/datapack list',
					'/datapack list available',
					'/datapack list enabled'
				],
	'debug':		[
					'/debug start',
					'/debug stop'
				],
	'defaultgamemode':	[
					'/defaultgamemode adventure',
					'/defaultgamemode creative',
					'/defaultgamemode spectator',
					'/defaultgamemode survival'
				],
	'deop':			[
					'/deop <targets>'
				],
	'difficulty':		[
					'/difficulty',
					'/difficulty easy',
					'/difficulty hard',
					'/difficulty normal',
					'/difficulty peaceful'
				],
	'effect':		[
					'/effect clear <targets>',
					'/effect clear <targets> <effect>',
					'/effect give <targets> <effect>',
					'/effect give <targets> <effect> <seconds>',
					'/effect give <targets> <effect> <seconds> <amplifier>',
					'/effect give <targets> <effect> <seconds> <amplifier> <hideParticles>'
				],
	'enchant':		[
					'/enchant <targets> <enchantment>',
					'/enchant <targets> <enchantment> <level>'
				],
	'execute':		[
					'/execute < subcommand >',
					'\nSubcommands:\n============',
					'run <command>',
					'align <axes> < subcommand >',
					'anchored eyes < subcommand >',
					'anchored feet < subcommand >',
					'as <targets> < subcommand >',
					'at <targets> < subcommand >',
					'facing entity <targets> eyes < subcommand >',
					'facing entity <targets> feet < subcommand >',
					'facing <pos> < subcommand >',
					'if block <pos> <block> < subcommand >',
					'if blocks <start> <end> <destination> all < subcommand >',
					'if blocks <start> <end> <destination> masked < subcommand >',
					'if entity <entities> < subcommand >',
					'if score <target> <targetObjective> <operation> <source> <sourceObjective> < subcommand >',
					'if score <target> <targetObjective> matches <range> < subcommand >',
					'unless block <pos> <block> < subcommand >',
					'unless blocks <start> <end> <destination> all < subcommand >',
					'unless blocks <start> <end> <destination> masked < subcommand >',
					'unless entity <entities> < subcommand >',
					'unless score <target> <targetObjective> <operation> <source> <sourceObjective> < subcommand >',
					'unless score <target> <targetObjective> matches <range> < subcommand >',
					'in <dimension> < subcommand >',
					'positioned as <targets> < subcommand >',
					'positioned <pos> < subcommand >',
					'rotated as <targets> < subcommand >',
					'rotated <rot> < subcommand >',
					'store result block <pos> <path> <dataType> <scale> < subcommand >',
					'store result bossbar <id> max < subcommand >',
					'store result bossbar <id> value < subcommand >',
					'store result entity <targets> <path> <dataType> <scale> < subcommand >',
					'store result score <targets> <objective> < subcommand >',
					'store success block <pos> <path> <dataType> <scale> < subcommand >',
					'store success bossbar <id> max < subcommand >',
					'store success bossbar <id> value < subcommand >',
					'store success entity <targets> <path> <dataType> <scale> < subcommand >',
					'store success score <targets> <objective> < subcommand >'
				],
	'experience':		[
					'/experience add <targets> <amount>',
					'/experience add <targets> <amount> levels',
					'/experience add <targets> <amount> points',
					'/experience query <targets> levels',
					'/experience query <targets> points',
					'/experience set <targets> <amount>',
					'/experience set <targets> <amount> levels',
					'/experience set <targets> <amount> points'
				],
	'fill':			[
					'/fill <from> <to> <block>',
					'/fill <from> <to> <block> destroy',
					'/fill <from> <to> <block> hollow',
					'/fill <from> <to> <block> keep',
					'/fill <from> <to> <block> outline',
					'/fill <from> <to> <block> replace',
					'/fill <from> <to> <block> replace <filter>'
				],
	'function':		[
					'/function <name>'
				],
	'gamemode':		[
					'/gamemode adventure',
					'/gamemode adventure <target>',
					'/gamemode creative',
					'/gamemode creative <target>',
					'/gamemode spectator',
					'/gamemode spectator <target>',
					'/gamemode survival',
					'/gamemode survival <target>'
				],
	'gamerule':		[
					'/gamerule <rule>',
					'/gamerule <rule> <value>'
				],
	'give':			[
					'/give <targets> <item>',
					'/give <targets> <item> <count>'
				],
	'help':			[
					'/help',
					'/help <command>'
				],
	'kick':			[
					'/kick <targets>',
					'/kick <targets> <reason>'
				],
	'kill':			[
					'/kill <targets>'
				],
	'list':			[
					'/list',
					'/list uuids'
				],
	'locate':		[
					'/locate <structure>'
				],
	'me':			[
					'/me <action>'
				],
	'msg':			[
					'/msg <targets> <message>'
				],
	'op':			[
					'/op <targets>'
				],
	'pardon':		[
					'/pardon <targets>'
				],
	'pardon-ip':		[
					'/pardon-ip <target>'
				],
	'particle':		[
					'/particle <name>',
					'/particle <name> <pos> <delta> <speed> <count>',
					'/particle <name> <pos> <delta> <speed> <count> force',
					'/particle <name> <pos> <delta> <speed> <count> force <viewers>',
					'/particle <name> <pos> <delta> <speed> <count> normal',
					'/particle <name> <pos> <delta> <speed> <count> normal <viewers>'
				],
	'playsound':		[
					'/playsound <sound> <source> <targets>',
					'/playsound <sound> <source> <targets> <pos>',
					'/playsound <sound> <source> <targets> <pos> <volume>',
					'/playsound <sound> <source> <targets> <pos> <volume> <pitch>',
					'/playsound <sound> <source> <targets> <pos> <volume> <pitch> <minVolume>'
				],
	'publish':		[
					'/publish',
					'/publish <port>'
				],
	'recipe':		[
					'/recipe give <targets> *',
					'/recipe give <targets> <recipe>',
					'/recipe take <targets> *',
					'/recipe take <targets> <recipe>'
				],
	'reload':		[
					'/reload'
				],
	'replaceitem':		[
					'/replaceitem block <pos> <slot> <item>',
					'/replaceitem block <pos> <slot> <item> <count>',
					'/replaceitem entity <targets> <slot> <item>',
					'/replaceitem entity <targets> <slot> <item> <count>'
				],
	'save-all':		[
					'/save-all',
					'/save-all flush'
				],
	'save-off':		[
					'/save-off'
				],
	'save-on':		[
					'/save-on'
				],
	'say':			[
					'/say <message>'
				],
	'scoreboard':		[
					'/scoreboard objectives add <objective> <criteria>',
					'/scoreboard objectives add <objective> <criteria> <displayName>',
					'/scoreboard objectives list',
					'/scoreboard objectives remove <objective>',
					'/scoreboard objectives setdisplay <slot>',
					'/scoreboard objectives setdisplay <slot> <objective>',
					'/scoreboard players add <targets> <objective> <score>',
					'/scoreboard players enable <targets> <objective>',
					'/scoreboard players get <target> <objective>',
					'/scoreboard players list',
					'/scoreboard players list <target>',
					'/scoreboard players operation <targets> <targetObjective> <operation> <source> <sourceObjective>',
					'/scoreboard players remove <targets> <objective> <score>',
					'/scoreboard players reset <targets>',
					'/scoreboard players reset <targets> <objective>',
					'/scoreboard players set <targets> <objective> <score>'
				],
	'seed':			[
					'/seed'
				],
	'setblock':		[
					'/setblock <pos> <block>',
					'/setblock <pos> <block> destroy',
					'/setblock <pos> <block> keep',
					'/setblock <pos> <block> replace'
				],
	'setidletimeout':	[
					'/setidletimeout <seconds>'
				],
	'setworldspawn':	[
					'/setworldspawn',
					'/setworldspawn <pos>'
				],
	'spawnpoint':		[
					'/spawnpoint',
					'/spawnpoint <targets>',
					'/spawnpoint <targets> <pos>'
				],
	'spreadplayers':	[
					'/spreadplayers <center> <spreadDistance> <maxRange> <respectTeams> <targets>'
				],
	'stop':			[
					'/stop'
				],
	'stopsound':		[
					'/stopsound <targets>',
					'/stopsound <targets> <source>',
					'/stopsound <targets> <source> <sound>'
				],
	'summon':		[
					'/summon <entity>',
					'/summon <entity> <pos>',
					'/summon <entity> <pos> <nbt>'
				],
	'tag':			[
					'/tag <targets> add <name>',
					'/tag <targets> list',
					'/tag <targets> remove <name>'
				],
	'team':			[
					'/team add <team>',
					'/team add <team> <displayName>',
					'/team empty <team>',
					'/team join <team>',
					'/team join <team> <members>',
					'/team leave <members>',
					'/team list',
					'/team list <team>',
					'/team option <team> <option> <value>',
					'/team remove <team>'
				],
	'teleport':		[
					'/teleport <destination>',
					'/teleport <location>',
					'/teleport <targets> <destination>',
					'/teleport <targets> <location>',
					'/teleport <targets> <location> <rotation>',
					'/teleport <targets> <location> facing <facingLocation>',
					'/teleport <targets> <location> facing entity <facingEntity> eyes',
					'/teleport <targets> <location> facing entity <facingEntity> feet'
				],
	'tellraw':		[
					'/tellraw <targets> <message>'
				],
	'tickingarea':		[
					'/* This command is Bedrock Edition only */',
					'/tickingarea add <from: x y z> <to: x y z>',
					'/tickingarea add <from: x y z> <to: x y z> <name: string>',
					'/tickingarea add circle <center: x y z> <radius: int>',
					'/tickingarea add circle <center: x y z> <radius: int> <name: string>',
					'/tickingarea remove <name: string>',
					'/tickingarea remove <position: x y z>',
					'/tickingarea remove_all',
					'/tickingarea list',
					'/tickingarea list all-dimensions'
				],
	'time':			[
					'/time add <time>',
					'/time query day',
					'/time query daytime',
					'/time query gametime',
					'/time set day',
					'/time set midnight',
					'/time set night',
					'/time set noon',
					'/time set <time>'
				],
	'title':		[
					'/title <targets> actionbar <title>',
					'/title <targets> clear',
					'/title <targets> reset',
					'/title <targets> subtitle <title>',
					'/title <targets> times <fadeIn> <stay> <fadeOut>',
					'/title <targets> title <title>'
				],
	'transferserver':		[
					'/* This command is Bedrock Edition only */',
					'/transferserver <server: string> <port: int>'
				],
	'trigger':		[
					'/trigger <objective>',
					'/trigger <objective> add <value>',
					'/trigger <objective> set <value>'
				],
	'weather':		[
					'/weather clear',
					'/weather clear <duration>',
					'/weather rain',
					'/weather rain <duration>',
					'/weather thunder',
					'/weather thunder <duration>'
				],
	'whitelist':		[
					'/whitelist add <targets>',
					'/whitelist list',
					'/whitelist off',
					'/whitelist on',
					'/whitelist reload',
					'/whitelist remove <targets>'
				],
	'worldborder':		[
					'/worldborder add <distance>',
					'/worldborder add <distance> <time>',
					'/worldborder center <pos>',
					'/worldborder damage amount <damagePerBlock>',
					'/worldborder damage buffer <distance>',
					'/worldborder get',
					'/worldborder set <distance>',
					'/worldborder set <distance> <time>',
					'/worldborder warning distance <distance>',
					'/worldborder warning time <time>'
				],
	'wsserver':		[
					'/* This command is Bedrock Edition only */',
					'/wsserver <serverUri: string>'
				]
}

var aliase = {
	'connect': 'wsserver',
	'tell': 'msg',
	'tp': 'teleport',
	'w': 'msg',
	'xp': 'experience'
}

function cmd_befehl(lang, msg, befehl, args) {
	var aliasCmd = ( befehl in aliase ) ? aliase[befehl] : befehl;
	
	if ( aliasCmd in befehle ) {
		var regex = new RegExp('/' + aliasCmd, 'g');
		var cmdSyntax = befehle[aliasCmd].join( '\n' ).replace( regex, '/' + befehl );
		msg.channel.send('```markdown\n' + cmdSyntax + '\n```\n<https://minecraft-de.gamepedia.com/Befehl/' + aliasCmd + '>');
	}
	else {
		msg.react('❓');
	}
}

function cmd_enbefehl(lang, msg, befehl, args) {
	var aliasCmd = ( befehl in aliase ) ? aliase[befehl] : befehl;
	
	if ( aliasCmd in enbefehle ) {
		var regex = new RegExp('/' + aliasCmd, 'g');
		var cmdSyntax = enbefehle[aliasCmd].join( '\n' ).replace( regex, '/' + befehl );
		msg.channel.send('```markdown\n' + cmdSyntax + '\n```\n<https://minecraft.gamepedia.com/Commands/' + aliasCmd + '>');
	}
	else {
		msg.react('❓');
	}
}

function cmd_befehl2(lang, msg, args, line) {
	if ( args.length ) {
		if ( lang ) {
			if ( args[0].startsWith('/') ) {
				cmd_enbefehl(lang, msg, args[0].substr(1), args.slice(1));
			}
			else {
				cmd_enbefehl(lang, msg, args[0], args.slice(1));
			}
		}
		else {
			if ( args[0].startsWith('/') ) {
				cmd_befehl(lang, msg, args[0].substr(1), args.slice(1));
			}
			else {
				cmd_befehl(lang, msg, args[0], args.slice(1));
			}
		}
	}
	else {
		cmd_link(lang, msg, line.split(' ')[1], 'minecraft' + (lang ? '' : '-de'), '');
	}
}

function cmd_delete(lang, msg, args, line) {
	if ( msg.channel.type == 'text' && ( msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
		if ( parseInt(args[0], 10) + 1 > 0 ) {
			if ( parseInt(args[0], 10) > 99 ) {
				if ( lang ) msg.reply('the specified number is too big. The maximum is `99`!');
				else msg.reply('deine angegebene Anzahl ist zu groß. Die maximale Anzahl ist `99`!');
			}
			else {
				msg.channel.bulkDelete(parseInt(args[0], 10) + 1, true);
				if ( lang ) msg.reply('the most recent ' + args[0] + ' messages in this channel were deleted.').then( antwort => antwort.delete(5000) );
				else msg.reply('die letzten ' + args[0] + ' Nachrichten in diesem Kanal wurden gelöscht.').then( antwort => antwort.delete(5000) );
				console.log('die letzten ' + args[0] + ' Nachrichten in #' + msg.channel.name + ' wurden gelöscht!');
			}
		}
		else {
			if ( lang ) msg.reply('the specified number isn\'t valid.');
			else msg.reply('du hast keine gültige Anzahl angegeben.');
		}
	} else {
		msg.react('❌');
	}
}

function cmd_link(lang, msg, title, wiki, cmd) {
	var invoke = title.split('_')[0].toLowerCase();
	var args = title.split('_').slice(1);
	
	if ( invoke == 'seite' || invoke == 'page' ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + args.join('_') );
	else if ( invoke == 'suche' || invoke == 'search' ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/Special:Search/' + args.join('_') );
	else if ( invoke == 'diff' ) cmd_diff(lang, msg, args, wiki);
	else if ( title == '' || title.indexOf( '#' ) != -1 || title.indexOf( '?' ) != -1 ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title );
	else if ( invoke == 'user' || invoke == 'benutzer' || invoke == 'benutzerin' ) cmd_user(lang, msg, args.join('_'), wiki, title);
	else if ( invoke.startsWith('user:') ) cmd_user(lang, msg, title.substr(5), wiki, title);
	else if ( invoke.startsWith('benutzer:') ) cmd_user(lang, msg, title.substr(9), wiki, title);
	else if ( invoke.startsWith('benutzerin:') ) cmd_user(lang, msg, title.substr(11), wiki, title);
	else if ( invoke.startsWith('userprofile:') ) cmd_user(lang, msg, title.substr(12), wiki, title);
	else {
		var hourglass;
		msg.react('⏳').then( function( reaction ) {
			hourglass = reaction;
			request( {
				uri: 'https://' + wiki + '.gamepedia.com/api.php?action=query&format=json&list=search&srnamespace=0|4|6|10|12|14&srsearch=' + title + '&srlimit=1',
				json: true
			}, function( error, response, body ) {
				if ( error || !response || !body || !body.query || ( !body.query.search[0] && body.query.searchinfo.totalhits != 0 ) ) {
					console.log( 'Fehler beim Erhalten der Suchergebnisse' + ( error ? ': ' + error.message : ( body ? ( body.error ? ': ' + body.error.info : '.' ) : '.' ) ) );
					msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title ).then( message => message.react('440871715938238494') );
				}
				else {
					if ( body.query.searchinfo.totalhits == 0 ) {
						msg.react('🤷');
					}
					else if ( body.query.searchinfo.totalhits == 1 ) {
						msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + encodeURI( body.query.search[0].title.replace( / /g, '_' ) ) );
					}
					else {
						if ( lang ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + encodeURI( body.query.search[0].title.replace( / /g, '_' ) ) + '\nNot the correct result? Use `' + process.env.prefix + cmd + 'search ' + title.replace( /_/g, ' ' ) + '` for a list of all hits or `' + process.env.prefix + cmd + 'page ' + title.replace( /_/g, ' ' ) + '` for a direct link!' );
						else msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + encodeURI( body.query.search[0].title.replace( / /g, '_' ) ) + '\nNicht das richtige Ergebnis? Nutze `' + process.env.prefix + cmd + 'suche ' + title.replace( /_/g, ' ' ) + '` für eine Liste mit allen Treffern oder `' + process.env.prefix + cmd + 'seite ' + title.replace( /_/g, ' ' ) + '` für einen direkten Link!' );
					}
				}
				
				if ( hourglass != undefined ) hourglass.remove();
			} );
		} );
	}
}

function cmd_info(lang, msg, args, line) {
	if ( msg.channel.type == 'text' && msg.guild.roles.find('name', 'Entwicklungsversion') ) {
		if ( msg.member.roles.find('name', 'Entwicklungsversion') ) {
			msg.member.removeRole(msg.member.guild.roles.find('name', 'Entwicklungsversion'), msg.member.displayName + ' wird nun nicht mehr bei neuen Entwicklungsversionen benachrichtigt.');
			console.log(msg.member.displayName + ' wird nun nicht mehr bei neuen Entwicklungsversionen benachrichtigt.');
			msg.react('🔕');
		}
		else {
			msg.member.addRole(msg.member.guild.roles.find('name', 'Entwicklungsversion'), msg.member.displayName + ' wird nun bei neuen Entwicklungsversionen benachrichtigt.');
			console.log(msg.member.displayName + ' wird nun bei neuen Entwicklungsversionen benachrichtigt.');
			msg.react('🔔');
		}
	}
	else {
		msg.react('❌');
	}
}

function cmd_serverlist(lang, msg, args, line) {
	if ( msg.author.id == process.env.owner && args.join(' ') == 'list all <@' + client.user.id + '>' ) {
		var guilds = client.guilds;
		var serverlist = 'Ich befinde mich aktuell auf ' + guilds.size + ' Servern:\n\n';
		guilds.forEach( function(guild) {
			serverlist += '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() + '\n\n';
		} );
		msg.author.send(serverlist);
	} else if ( !pause ) {
		cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft' + (lang ? '' : '-de'), '');
	}
}

function cmd_umfrage(lang, msg, args, line) {
	if ( msg.channel.type == 'text' && ( msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
		if ( args.length ) {
			var reactions = [];
			args = emoji(args);
			for ( var i = 0; i < args.length; i++ ) {
				var reaction = args[i];
				var custom = /^<a?:/;
				var pattern = /^[\w\säÄöÖüÜßẞ!"#$%&'()*+,./:;<=>?@^`{|}~–[\]\-\\]{2,}/;
				if ( !custom.test(reaction) && pattern.test(reaction) ) {
					var poll = 'Umfrage';
					if ( lang ) poll = 'Poll';
					msg.channel.send('**' + poll + ':**\n' + args.slice(i).join(' ')).then( poll => {
						if ( reactions.length ) {
							reactions.forEach( function(entry) {
								poll.react(entry).catch( error => poll.react('440871715938238494') );
							} );
						} else {
							poll.react('448222377009086465');
							poll.react('448222455425794059');
						}
					} );
					msg.delete();
					break;
				} else if ( reaction == '' ) {
				} else {
					if ( custom.test(reaction) ) {
						reaction = reaction.substring(reaction.lastIndexOf(':')+1, reaction.length-1);
					}
					reactions[i] = reaction;
				}
			}
		} else {
			if ( lang ) msg.reply('write out the possible answers separated by a space and then your question:```markdown\n' + process.env.prefix + line.split(' ')[1] + ' [<emoji> <emoji> ...] <question as free text>```');
			else msg.reply('schreibe zuerst die Antwortmöglichkeiten mit Leerzeichen getrennt und dann deine Frage:```markdown\n' + process.env.prefix + line.split(' ')[1] + ' [<Emoji> <Emoji> ...] <Frage als Freitext>```');
		}
	} else {
		msg.react('❌');
	}
}

function cmd_user(lang, msg, username, wiki, title) {
	if ( !username || username.indexOf( '/' ) != -1 || username.toLowerCase().startsWith('talk:') || username.toLowerCase().startsWith('diskussion:') ) {
		msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title );
	} else {
		var hourglass;
		msg.react('⏳').then( function( reaction ) {
			hourglass = reaction;
			request( {
				uri: 'https://' + wiki + '.gamepedia.com/api.php?action=query&format=json&list=users&usprop=blockinfo|groups|editcount|registration|gender&ususers=' + username,
				json: true
			}, function( error, response, body ) {
				if ( error || !response || !body || !body.query || !body.query.users[0] ) {
					console.log( 'Fehler beim Erhalten der Suchergebnisse' + ( error ? ': ' + error.message : ( body ? ( body.error ? ': ' + body.error.info : '.' ) : '.' ) ) );
					msg.channel.send( '<https://' + wiki + '.gamepedia.com/UserProfile:' + username + '>' ).then( message => message.react('440871715938238494') );
				}
				else {
					if ( body.query.users[0].missing == "" || body.query.users[0].invalid == "" ) {
						msg.react('🤷');
					}
					else {
						var options = {  
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit"
						}
						var gender = body.query.users[0].gender;
						if ( !lang ) {
							switch (gender) {
								case 'male':
									gender = 'Männlich';
									break;
								case 'female':
									gender = 'Weiblich';
									break;
								default: 
									gender = 'Unbekannt';
							}
						}
						var registration = (new Date(body.query.users[0].registration)).toLocaleString(( lang ? 'en-US' : 'de-DE' ), options);
						var editcount = body.query.users[0].editcount;
						var groups = body.query.users[0].groups;
						var group = '';
						if ( lang ) {
							if ( groups.includes('global_bot') ) group = 'Gamepedia bot';
							else if ( groups.includes('hydra_staff') ) group = 'Gamepedia staff';
							else if ( groups.includes('bot') ) group = 'Bot';
							else if ( groups.includes('bureaucrat') ) group = 'Bureaucrat';
							else if ( groups.includes('sysop') ) group = 'Administrator';
							else if ( groups.includes('grasp') ) group = 'GRASP';
							else if ( groups.includes('directors') ) group = 'Director';
							else if ( groups.includes('autopatrol') ) group = 'autopatrol';
							else group = 'User';
						} else {
							if ( groups.includes('global_bot') ) group = 'Gamepedia-Bot';
							else if ( groups.includes('hydra_staff') ) group = 'Gamepedia-Mitarbeiter';
							else if ( groups.includes('bot') ) group = 'Bot';
							else if ( groups.includes('bureaucrat') ) group = 'Bürokrat';
							else if ( groups.includes('sysop') ) group = 'Administrator';
							else if ( groups.includes('grasp') ) group = 'GRASP';
							else group = 'Benutzer';
						}
						var blockid = body.query.users[0].blockid;
						var blockedtimestamp = (new Date(body.query.users[0].blockedtimestamp)).toLocaleString(( lang ? 'en-US' : 'de-DE' ), options);
						var blockexpiry = body.query.users[0].blockexpiry;
						if ( blockexpiry == 'infinity' ) {
							if ( lang ) blockexpiry = 'the end of all days';
							else blockexpiry = 'Ende aller Tage';
						} else if ( blockexpiry ) {
							blockexpiry = (new Date(blockexpiry.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2,3})/, '$1-$2-$3T$4:$5:$6Z'))).toLocaleString(( lang ? 'en-US' : 'de-DE' ), options);
						}
						var blockedby = body.query.users[0].blockedby;
						var blockreason = body.query.users[0].blockreason;
						if ( lang ) msg.channel.send( '<https://' + wiki + '.gamepedia.com/UserProfile:' + username + '>\n\nGender: ' + gender + '\nRegistration date: ' + registration + '\nEdit count: ' + editcount + '\nGroup: ' + group + ( blockid ? '\n\n**This user is currently blocked!**\nBlocked on ' + blockedtimestamp + ' until ' + blockexpiry + ' by ' + blockedby + ' with reason "' + blockreason + '".' : '' ));
						else msg.channel.send( '<https://' + wiki + '.gamepedia.com/UserProfile:' + username + '>\n\nGeschlecht: ' + gender + '\nRegistiert: ' + registration + '\nBearbeitungen: ' + editcount + '\nGruppe: ' + group + ( blockid ? '\n\n**Dieser Benutzer ist derzeit gesperrt!**\nGesperrt am ' + blockedtimestamp + ' bis zum ' + blockexpiry + ' von ' + blockedby + ' mit der Begründung "' + blockreason + '".' : '' ));
					}
				}
				
				if ( hourglass != undefined ) hourglass.remove();
			} );
		} );
	}
}

function cmd_diff(lang, msg, args, wiki) {
	if ( args[0] ){
		var title = '';
		var x;
		for ( var i = 0; i < args.length; i++ ) {
			if ( parseInt(args[i], 10) || args[i] == 'next' || args[i] == 'prev' ) {
				x = i;
				i = args.length;
			} else {
				if ( title ) title += '_';
				title += args[i];
			}
		}
		msg.channel.send( '<https://' + wiki + '.gamepedia.com/' + title + '?diff=' + ( args[x] ? args[x] + ( args[x+1] ? '&oldid=' + args[x+1] : '' ) : '' ) + '>' );
	}
	else msg.react('440871715938238494');
}

function cmd_multiline(lang, msg, args, line) {
	msg.react('440871715938238494');
}

function cmd_bug(lang, msg, args, line) {
	if ( args.length ) {
		var project = '';
		if ( parseInt(args[0], 10) ) project = 'MC-';
		msg.channel.send( 'https://bugs.mojang.com/browse/' + project + args[0] );
	}
	else {
		cmd_link(lang, msg, line.split(' ')[1], 'minecraft' + (lang ? '' : '-de'), '');
	}
}

function emoji(args) {
	var text = args.join(' ');
	var regex = /(<a?:)(\d+)(>)/g;
	if ( regex.test(text) ) {
		regex.lastIndex = 0;
		var emojis = client.emojis;
		var entry;
		while ( ( entry = regex.exec(text) ) !== null ) {
			if ( emojis.has(entry[2]) ) {
				text = text.replace(entry[0], emojis.get(entry[2]).toString());
			} else {
				text = text.replace(entry[0], entry[1] + 'unknown_emoji:' + entry[2] + entry[3]);
			}
		}
		args = text.split(' ');
	}
	return args;
}


client.on('message', msg => {
	var cont = msg.content;
	var author = msg.author;
	var channel = msg.channel;
	var lang = '';
	if ( msg.channel.type == 'text' && english.includes(msg.guild.id) ) lang = 'en';
	if ( !msg.webhookID && author.id != client.user.id ) {
		if ( cont.toLowerCase().startsWith(process.env.prefix) && cont.split(' ')[1].toLowerCase() in multilinecmdmap ) {
			var invoke = cont.split(' ')[1].toLowerCase();
			var args = cont.split(' ').slice(2);
			console.log((msg.guild ? msg.guild.name : '@' + author.username) + ': ' + invoke + ' - ' + args);
			if ( !pause || ( author.id == process.env.owner && invoke in pausecmdmap ) ) multilinecmdmap[invoke](lang, msg, args, cont);
		} else {
			cont.split('\n').forEach( function(line) {
				if ( line.toLowerCase().startsWith(process.env.prefix) ) {
					var invoke = line.split(' ')[1].toLowerCase();
					var args = line.split(' ').slice(2);
					console.log((msg.guild ? msg.guild.name : '@' + author.username) + ': ' + invoke + ' - ' + args);
					if ( !pause && !lang ) {
						if ( invoke in cmdmap ) cmdmap[invoke](lang, msg, args, line);
						else if ( invoke.startsWith('/') ) cmd_befehl(lang, msg, invoke.substr(1), args);
						else if ( invoke.startsWith('!') ) cmd_link(lang, msg, args.join('_'), invoke.substr(1), invoke + ' ');
						else cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft-de', '');
					} else if ( !pause && lang ) {
						if ( invoke in encmdmap ) encmdmap[invoke](lang, msg, args, line);
						else if ( invoke.startsWith('/') ) cmd_enbefehl(lang, msg, invoke.substr(1), args);
						else if ( invoke.startsWith('!') ) cmd_link(lang, msg, args.join('_'), invoke.substr(1), invoke + ' ');
						else cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft', '');
					} else if ( pause && author.id == process.env.owner && invoke in pausecmdmap ) {
						pausecmdmap[invoke](lang, msg, args, line);
					}
				}
			} );
		}
	}
});


client.on('voiceStateUpdate', (oldm, newm) => {
	if ( oldm.voiceChannelID != newm.voiceChannelID ) {
		if ( oldm.voiceChannel && oldm.guild.roles.find('name', 'Sprachkanal – ' + oldm.voiceChannel.name) ) {
			oldm.removeRole(oldm.guild.roles.find('name', 'Sprachkanal – ' + oldm.voiceChannel.name), oldm.displayName + ' hat den Sprach-Kanal "' + oldm.voiceChannel.name + '" verlassen.');
			console.log(oldm.guild.name + ': ' + oldm.displayName + ' hat den Sprach-Kanal "' + oldm.voiceChannel.name + '" verlassen.');
		}
		if ( newm.voiceChannel && newm.guild.roles.find('name', 'Sprachkanal – ' + newm.voiceChannel.name) ) {
			newm.addRole(newm.guild.roles.find('name', 'Sprachkanal – ' + newm.voiceChannel.name), newm.displayName + ' hat den Sprach-Kanal "' + newm.voiceChannel.name + '" betreten.');
			console.log(newm.guild.name + ': ' + newm.displayName + ' hat den Sprach-Kanal "' + newm.voiceChannel.name + '" betreten.');
		}
	}
});


client.on('guildCreate', guild => {
	client.fetchUser(process.env.owner).then( owner => owner.send( 'Ich wurde zu einem Server hinzugefügt:\n\n' + '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() ) );
	console.log('Ich wurde zu einem Server hinzugefügt.');
});

client.on('guildDelete', guild => {
	client.fetchUser(process.env.owner).then( owner => owner.send( 'Ich wurde von einem Server entfernt:\n\n' + '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() ) );
	console.log('Ich wurde von einem Server entfernt.');
});


client.login(process.env.token);
