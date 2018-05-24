const Discord = require('discord.js');
var request = require('request');

var client = new Discord.Client();


var pause = false;
var english = [
	'447104142729674753',
	'422480985603571712'
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
	say: cmd_say,
	test: cmd_test,
	technik: cmd_technik,
	en: cmd_en,
	uwmc: cmd_uwmc,
	invite: cmd_invite,
	stop: cmd_stop,
	pause: cmd_pause,
	delete: cmd_delete,
	info: cmd_info,
	server: cmd_serverlist,
	umfrage: cmd_umfrage,
	poll: cmd_umfrage
}

var encmdmap = {
	help: cmd_enhelp,
	say: cmd_say,
	test: cmd_test,
	invite: cmd_invite,
	stop: cmd_stop,
	pause: cmd_pause,
	delete: cmd_delete,
	server: cmd_serverlist,
	poll: cmd_umfrage
}

var pausecmdmap = {
	say: cmd_say,
	test: cmd_test,
	stop: cmd_stop,
	pause: cmd_pause,
	delete: cmd_delete,
	server: cmd_serverlist
}

function cmd_help(lang, msg, args) {
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
		{ cmd: 'hilfe <Befehl>', desc: 'Frage mich, wie ein Befehl funktioniert.' },
		{ cmd: 'hilfe admin', desc: 'Ich liste alle Befehle für Administratoren auf.', admin: true },
		{ cmd: 'hilfe admin emoji', desc: 'Ich liste alle Server-Emoji auf, die ich kenne.', admin: true },
		{ cmd: 'help', desc: 'Ich liste alle Befehle auf.', hide: true },
		{ cmd: 'help <Befehl>', desc: 'Frage mich, wie ein Befehl funktioniert.', hide: true },
		{ cmd: 'help admin', desc: 'Ich liste alle Befehle für Administratoren auf.', hide: true, admin: true },
		{ cmd: 'help admin emoji', desc: 'Ich liste alle Server-Emoji auf, die ich kenne.', hide: true, admin: true },
		{ cmd: 'technik <Suchbegriff>', desc: 'Ich antworte mit einem Link auf einen passenden Artikel im Technik Wiki.' },
		{ cmd: 'technik seite <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Technik Wiki.', hide: true },
		{ cmd: 'technik suche <Suchbegriff>', desc: 'Ich antworte mit einem Link auf die Suchseite zu diesem Begriff im Technik Wiki.', hide: true },
		{ cmd: 'en <Suchbegriff>', desc: 'Ich antworte mit einem Link auf einen passenden Artikel im englischen Minecraft Wiki.' },
		{ cmd: 'en seite <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im englischen Minecraft Wiki.', hide: true },
		{ cmd: 'en suche <Suchbegriff>', desc: 'Ich antworte mit einem Link auf die Suchseite zu diesem Begriff im englischen Minecraft Wiki.', hide: true },
		{ cmd: '!<Wiki> <Suchbegriff>', desc: 'Ich antworte mit einem Link auf einen passenden Artikel im angegebenen Gamepedia-Wiki: `https://<Wiki>.gamepedia.com/`', unsearchable: true },
		{ cmd: 'umfrage [<Emoji> <Emoji> ...] <Frage als Freitext>', desc: 'Ich erstelle eine Umfrage und reagiere mit den möglichen Antworten.', admin: true },
		{ cmd: 'poll [<Emoji> <Emoji> ...] <Frage als Freitext>', desc: 'Ich erstelle eine Umfrage und reagiere mit den möglichen Antworten.', hide: true, admin: true },
		{ cmd: 'test', desc: 'Wenn ich gerade aktiv bin, werde ich antworten! Sonst nicht.' },
		{ cmd: 'uwmc <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Unlimitedworld-Forum.' },
		{ cmd: 'invite', desc: 'Ich antworte mit einem Invite-Link für den Server des deutschen Minecraft Wiki.' },
		{ cmd: 'say <Nachricht>', desc: 'Ich schreibe die angegebene Nachricht.', admin: true },
		{ cmd: 'say alarm <Nachricht>', desc: 'Ich schreibe die angegebene Nachricht bereits vorformatiert: 🚨 **<Nachricht>** 🚨', admin: true },
		{ cmd: 'delete <Anzahl>', desc: 'Ich lösche die letzten Nachrichten in dem Kanal, solange sie nicht älter als 14 Tage sind.', admin: true },
		{ cmd: 'info', desc: 'Du wirst bei neuen Entwicklungsversionen auf dem Server des deutschen Minecraft Wiki erwähnt.' }
	]
	
	if ( args.length ) {
		if ( args[0].toLowerCase() == 'admin' && ( msg.channel.type != 'text' || msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
			if ( args[1] && args[1].toLowerCase() == 'emoji' ) {
				var cmdlist = 'Dies sind alle Server-Emoji, die ich nutzen kann:\n';
				var emojis = client.emojis;
				emojis.forEach( function(emoji) {
					cmdlist += emoji.toString() + '`' + emoji.toString().replace(emoji.name + ':', '') + '`\n';
				} );
				msg.channel.send(cmdlist);
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

function cmd_enhelp(lang, msg, args) {
	var cmds = [
		{ cmd: '<search term>', desc: 'I answer with a link to a matching article in the Minecraft Wiki.', unsearchable: true },
		{ cmd: 'page <page name>', desc: 'I answer with a link to the article in the Minecraft Wiki.' },
		{ cmd: 'search <search term>', desc: 'I answer with a link to the search page for the article in the Minecraft Wiki.' },
		{ cmd: 'help', desc: 'I list all commands.' },
		{ cmd: 'help <command>', desc: 'Wonder how a command works.' },
		{ cmd: 'help admin', desc: 'I list all commands for administrators.', admin: true },
		{ cmd: 'help admin emoji', desc: 'I list all server emoji that I can use.', admin: true },
		{ cmd: '!<wiki> <search term>', desc: 'I answer with a link to a matching article in the named Gamepedia wiki: `https://<wiki>.gamepedia.com/`', unsearchable: true },
		{ cmd: 'poll [<emoji> <emoji> ...] <question as free text>', desc: 'I create a poll and react with the possible answers.', admin: true },
		{ cmd: 'test', desc: 'If I\'m active, I\'ll answer! Otherwise not.' },
		{ cmd: 'invite', desc: 'I send an Invite link for the server of Minecraft Wiki.' },
		{ cmd: 'say <message>', desc: 'I write the given message.', admin: true },
		{ cmd: 'say alarm <message>', desc: 'I write the given message already preformatted: 🚨 **<message>** 🚨', admin: true },
		{ cmd: 'delete <count>', desc: 'I delete the recent messages in the channel, as long as they aren\'t older than 14 days.', admin: true }
	]
	
	if ( args.length ) {
		if ( args[0].toLowerCase() == 'admin' && ( msg.channel.type != 'text' || msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
			if ( args[1] && args[1].toLowerCase() == 'emoji' ) {
				var cmdlist = 'These are all server emoji that I can use:\n';
				var emojis = client.emojis;
				emojis.forEach( function(emoji) {
					cmdlist += emoji.toString() + '`' + emoji.toString().replace(emoji.name + ':', '') + '`\n';
				} );
				msg.channel.send(cmdlist);
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
		var cmdlist = 'So you want to know what I am made of? Here is a list of all commands that I understand:\n';
		for ( var i = 0; i < cmds.length; i++ ) {
			if ( !cmds[i].hide && !cmds[i].admin ) {
				cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
			}
		}
		
		msg.channel.send(cmdlist);
	}
}

function cmd_say(lang, msg, args) {
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

function cmd_test(lang, msg, args) {
	if ( !pause ) {
		var text = '';
		if ( lang ) text = 'I\'m fully functional!';
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
					text = 'ja ich funktioniere noch!';
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
		if ( lang ) msg.reply('I\'m currently inactive');
		else msg.reply('ich mache gerade eine Pause.');
		console.log('Dies ist ein Test: Pausiert!');
	}
}

function cmd_technik(lang, msg, args) {
	if ( !args.length ) {
		msg.channel.send( 'https://technic-de.gamepedia.com/Technik_Wiki' );
	}
	else {
		if ( args[0].toLowerCase().startsWith('wiki') ) {
			var title = 'Technik_' + args.join('_');
		} else {
			var title = args.join('_');
		}
		
		cmd_link(lang, msg, title, 'technic-de', 'technik ');
	}
}

function cmd_en(lang, msg, args) {
	cmd_link(lang, msg, args.join('_'), 'minecraft', 'en ');
}

function cmd_uwmc(lang, msg, args) {
	msg.channel.send('https://uwmc.de/' + args.join('-'));
}

function cmd_invite(lang, msg, args) {
	if ( lang ) {
		if ( args.length && args[0].toLowerCase() == 'minecraft' ) {
			msg.reply('here is the official Minecraft Discord:\nhttps://discord.gg/minecraft');
		} else if ( args.length && args[0].toLowerCase() == '<@' + client.user.id + '>' ) {
			client.generateInvite(268954689).then( invite => msg.reply('use this link to invite me to another server:\n' + invite) );
		} else {
			msg.reply('use this link to invite other user:\nhttps://discord.gg/fGdE5ZE');
		}
	} else {
		if ( args.length && args[0].toLowerCase() == 'minecraft' ) {
			msg.reply('hier findest du den offiziellen Minecraft-Discord:\nhttps://discord.gg/minecraft');
		} else if ( args.length && args[0].toLowerCase() == '<@' + client.user.id + '>' ) {
			client.generateInvite(268954689).then( invite => msg.reply('du kannst mich mit diesem Link auf einen anderen Server einladen:\n' + invite) );
		} else {
			msg.reply('du kannst andere Nutzer mit diesem Link einladen:\nhttps://discord.gg/F75vfpd');
		}
	}
}

function cmd_stop(lang, msg, args) {
	if ( msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		msg.reply('ich schalte mich nun aus!');
		console.log('Ich schalte mich nun aus!');
		client.destroy();
	} else if ( !pause ) {
		cmd_link(lang, msg, msg.content.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft' + (lang ? '' : '-de'), '');
	}
}

function cmd_pause(lang, msg, args) {
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
		cmd_link(lang, msg, msg.content.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft' + (lang ? '' : '-de'), '');
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
					'/enchant <Selektor> <Verzauberungs-ID> [<Stufe>]'
				],
	'execute':		[
					'/execute <Unterbefehl>',
					'\nUnterbefehle:\n=============',
					'run <Befehl>',
					'align <Achsen> <Unterbefehl>',
					'anchored eyes <Unterbefehl>',
					'anchored feet <Unterbefehl>',
					'as <Selektor> <Unterbefehl>',
					'at <Selektor> <Unterbefehl>',
					'facing <Position> <Unterbefehl>',
					'facing entity <Selektor> <Unterbefehl>',
					'if block <Position> <Block> <Unterbefehl>',
					'unless block <Position> <Block> <Unterbefehl>',
					'if blocks <Position1> <Position2> <Ziel-Position> <Block> <Unterbefehl>',
					'unless blocks <Position1> <Position2> <Ziel-Position> <Block> <Unterbefehl>',
					'if entity <Selektor> <Unterbefehl>',
					'unless entity <Selektor> <Unterbefehl>',
					'if score <Selektor> <Ziel> <Operation> <Selektor> <Ziel> <Unterbefehl>',
					'unless score <Selektor> <Ziel> <Operator> <Selektor> <Ziel> <Unterbefehl>',
					'if score <Selektor> <Ziel> matches <Punktebereich> <Unterbefehl>',
					'unless score <Selektor> <Ziel> matches <Punktebereich> <Unterbefehl>',
					'in <Dimension> <Unterbefehl>',
					'positioned <Position> <Unterbefehl>',
					'positioned as <Selektor> <Unterbefehl>',
					'rotated <Rotation> <Unterbefehl>',
					'rotated as <Selektor> <Unterbefehl>',
					'store result block <Position> <Pfad> <Typ> <Skalierung> <Unterbefehl>',
					'store success block <Position> <Pfad> <Typ> <Skalierung> <Unterbefehl>',
					'store result bossbar <Name> max <Pfad> <Typ> <Skalierung> <Unterbefehl>',
					'store success bossbar <Name> max <Pfad> <Typ> <Skalierung> <Unterbefehl>',
					'store result bossbar <Name> value <Pfad> <Typ> <Skalierung> <Unterbefehl>',
					'store success bossbar <Name> value <Pfad> <Typ> <Skalierung> <Unterbefehl>',
					'store result entity <Selektor> <Pfad> <Typ> <Skalierung> <Unterbefehl>',
					'store success entity <Selektor> <Pfad> <Typ> <Skalierung> <Unterbefehl>',
					'store result score <Selektor> <Ziel> <Unterbefehl>',
					'store success score <Selektor> <Ziel> <Unterbefehl>'
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
					'/list'
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
					'/teleport <Selektor> <Ziel-Position> facing <Selektor> eyes',
					'/teleport <Selektor> <Ziel-Position> facing <Selektor> feet'
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
					'/time set night',
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

var aliase = {
	'tell': 'msg',
	'tp': 'teleport',
	'w': 'msg',
	'xp': 'experience'
}

function cmd_befehl(lang, msg, befehl, args) {
	var aliasCmd = ( befehl in aliase ) ? aliase[befehl] : befehl;
	
	if ( aliasCmd in befehle ) {
		var cmdSyntax = befehle[aliasCmd].join( '\n' ).replace( '/' + aliasCmd, '/' + befehl );
		msg.channel.send('```markdown\n' + cmdSyntax + '\n```\nhttps://minecraft-de.gamepedia.com/Befehl/' + aliasCmd);
	}
	else {
		msg.react('❓');
	}
}

function cmd_befehl2(lang, msg, args) {
	if ( args.length ) {
		if ( args[0].startsWith('/') ) {
			cmd_befehl(lang, msg, args[0].substr(1), args.slice(1));
		}
		else {
			cmd_befehl(lang, msg, args[0], args.slice(1));
		}
	}
	else {
		cmd_link(lang, msg, msg.content.split(' ')[1], 'minecraft' + (lang ? '' : '-de'), '');
	}
}

function cmd_delete(lang, msg, args) {
	if ( msg.channel.type == 'text' && ( msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
		if ( parseInt(args[0], 10) + 1 > 0 ) {
			msg.channel.bulkDelete(parseInt(args[0], 10) + 1, true);
			if ( lang ) msg.reply('the recent ' + args[0] + ' messages in this channel were deleted.').then( antwort => antwort.delete(5000) );
			else msg.reply('die letzten ' + args[0] + ' Nachrichten in diesem Kanal wurden gelöscht.').then( antwort => antwort.delete(5000) );
			console.log('Die letzten ' + args[0] + ' Nachrichten in #' + msg.channel.name + ' wurden gelöscht!');
		}
		else {
			if ( lang ) msg.reply('the specified number isn\'t valid');
			else msg.reply('du hast keine gültige Anzahl angegeben.');
		}
	} else {
		msg.react('❌');
	}
}

function cmd_link(lang, msg, title, wiki, cmd) {
	var invoke = title.split('_')[0].toLowerCase();
	var args = title.split('_').slice(1);
	
	if ( title == '' || title.indexOf( '#' ) != -1 || title.indexOf( '?' ) != -1 ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title );
	else if ( invoke == 'seite' || invoke == 'page' ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + args.join('_') );
	else if ( invoke == 'suche' || invoke == 'search' ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/Special:Search/' + args.join('_') );
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

function cmd_info(lang, msg, args) {
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

function cmd_serverlist(lang, msg, args) {
	if ( msg.author.id == process.env.owner && args.join(' ') == 'list all <@' + client.user.id + '>' ) {
		var guilds = client.guilds;
		var serverlist = 'Ich befinde mich aktuell auf ' + guilds.size + ' Servern:\n\n';
		guilds.forEach( function(guild) {
			serverlist += '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() + '\n\n';
		} );
		msg.author.send(serverlist);
	} else if ( !pause ) {
		cmd_link(lang, msg, msg.content.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft' + (lang ? '' : '-de'), '');
	}
}

function cmd_umfrage(lang, msg, args) {
	if ( msg.channel.type == 'text' && ( msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
		if ( args.length ) {
			var reactions = [];
			args = emoji(args);
			for ( var i = 0; i < args.length; i++ ) {
				var reaction = args[i];
				var custom = /^<a?:/;
				var pattern = /^[\w\s!"#$%&'()*+,./:;<=>?@^`{|}~–[\]\-\\]{2,}/;
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
			if ( lang ) msg.reply('Write out the possible answers separated by a space and then your question:```markdown\n' + process.env.prefix + msg.content.split(' ')[1] + ' [<emoji> <emoji> ...] <question as free text>```');
			else msg.reply('Schreibe zuerst die Antwortmöglichkeiten mit Leerzeichen getrennt und dann deine Frage:```markdown\n' + process.env.prefix + msg.content.split(' ')[1] + ' [<Emoji> <Emoji> ...] <Frage als Freitext>```');
		}
	} else {
		msg.react('❌');
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
	if ( cont.toLowerCase().startsWith(process.env.prefix) && !msg.webhookID && author.id != client.user.id ) {
		var invoke = cont.split(' ')[1].toLowerCase();
		var args = cont.split(' ').slice(2);
		var lang = '';
		if ( msg.channel.type == 'text' && english.includes(msg.guild.id) ) lang = 'en';
		console.log((msg.guild ? msg.guild.name : '@' + author.username) + ': ' + invoke + ' - ' + args);
		if ( !pause && !lang ) {
			if ( invoke in cmdmap ) {
				cmdmap[invoke](lang, msg, args);
			} else if ( invoke.startsWith('/') ) {
				cmd_befehl(lang, msg, invoke.substr(1), args);
			} else if ( invoke.startsWith('!') ) {
				cmd_link(lang, msg, args.join('_'), invoke.substr(1), invoke + ' ');
			} else {
				cmd_link(lang, msg, cont.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft-de', '');
			}
		} else if ( !pause && lang ) {
			if ( invoke in encmdmap ) {
				encmdmap[invoke](lang, msg, args);
			} else if ( invoke.startsWith('!') ) {
				cmd_link(lang, msg, args.join('_'), invoke.substr(1), invoke + ' ');
			} else {
				cmd_link(lang, msg, cont.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), 'minecraft', '');
			}
		} else if ( pause && author.id == process.env.owner && invoke in pausecmdmap ) {
			pausecmdmap[invoke](lang, msg, args);
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
