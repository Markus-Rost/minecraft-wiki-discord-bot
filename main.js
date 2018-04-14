const Discord = require('discord.js');
var request = require('request');

var client = new Discord.Client();


var pause = false;


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
	seite: cmd_seite,
	page: cmd_seite,
	technik: cmd_technik,
	en: cmd_en,
	uwmc: cmd_uwmc,
	invite: cmd_invite,
	search: cmd_search,
	suche: cmd_search,
	stop: cmd_stop,
	pause: cmd_pause
}

function cmd_help(msg, args) {
	var cmds = [
		{ cmd: '<Suchbegriff>', desc: 'Ich antworte mit einem Link auf einen passenden Artikel im Minecraft Wiki', unsearchable: true },
		{ cmd: '/<Minecraft-Befehl>', desc: 'Ich antworte mit der Syntax des angegebenen Minecraft-Befehls und einem Link auf den Artikel zu diesem Befehl im Minecraft Wiki', unsearchable: true },
		{ cmd: 'befehl <Minecraft-Befehl>', desc: 'Ich antworte mit der Syntax des angegebenen Minecraft-Befehls und einem Link auf den Artikel zu diesem Befehl im Minecraft Wiki', hide: true },
		{ cmd: 'command <Minecraft-Befehl>', desc: 'Ich antworte mit der Syntax des angegebenen Minecraft-Befehls und einem Link auf den Artikel zu diesem Befehl im Minecraft Wiki', hide: true },
		{ cmd: 'cmd <Minecraft-Befehl>', desc: 'Ich antworte mit der Syntax des angegebenen Minecraft-Befehls und einem Link auf den Artikel zu diesem Befehl im Minecraft Wiki', hide: true },
		{ cmd: 'hilfe', desc: 'Liste alle Befehle auf' },
		{ cmd: 'hilfe [<Befehl>]', desc: 'Frage mich, wie ein Befehl funktioniert' },
		{ cmd: 'help', desc: 'Liste alle Befehle auf', hide: true },
		{ cmd: 'help [<Befehl>]', desc: 'Frage mich, wie ein Befehl funktioniert', hide: true },
		{ cmd: 'test', desc: 'Wenn ich gerade aktiv bin, werde ich antworten! Sonst nicht.' },
		{ cmd: 'seite <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Minecraft Wiki' },
		{ cmd: 'page <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Minecraft Wiki', hide: true },
		{ cmd: 'technik <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Technik Wiki' },
		{ cmd: 'en <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im englischen Minecraft Wiki' },
		{ cmd: 'uwmc <Seitenname>', desc: 'Ich antworte mit einem Link zu der angegebenen Seite im Unlimitedworld-Forum' },
		{ cmd: 'invite', desc: 'Ich antworte mit dem Invite-Link für diesen Server' },
		{ cmd: 'suche <Suchbegriff>', desc: 'Ich antworte mit einem Link auf die Suchseite zu diesem Begriff im Minecraft Wiki.' },
		{ cmd: 'search <Suchbegriff>', desc: 'Ich antworte mit einem Link auf die Suchseite zu diesem Begriff im Minecraft Wiki.', hide: true }
	]
	
	if ( args.length ) {
		var cmdlist = ''
		for ( var i = 0; i < cmds.length; i++ ) {
			if ( cmds[i].cmd.split(' ')[0] === args[0].toLowerCase() && !cmds[i].unsearchable ) {
				cmdlist += '🔹 `!wiki ' + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
			}
		}
		
		if ( cmdlist == '' ) msg.react('❓');
		else msg.channel.send(cmdlist);
	}	
	else {
		var cmdlist = 'Du willst also wissen, was ich so drauf habe? Hier ist eine Liste aller Befehle, die ich verstehe:\n';
		for ( var i = 0; i < cmds.length; i++ ) {
			if ( !cmds[i].hide ) {
				cmdlist += '🔹 `!wiki ' + cmds[i].cmd + '\n\t' + cmds[i].desc + '\n';
			}
		}
		
		msg.channel.send(cmdlist);
	}
}

function cmd_say(msg, args) {
	if ( msg.author.id == msg.guild.ownerID || msg.author.id == process.env.owner || ( msg.member != null && msg.member.roles.find('name', 'Administrator') ) ) {
		if ( args[0] == 'alarm' ) {
			msg.channel.send(':rotating_light: **' + args.slice(1).join(' ') + '** :rotating_light:');
		} else {
			msg.channel.send(args.join(' '));
		}
		msg.delete();
	} else {
		msg.react('❌')
	}
}

function cmd_test(msg, args) {
	if ( !pause ) {
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
		console.log('Dies ist ein Test: Voll funktionsfähig!');
	} else {
		msg.reply('ich mache gerade eine Pause.');
		console.log('Dies ist ein Test: Pausiert!');
	}
}

function cmd_seite(msg, args) {
	msg.channel.send('https://minecraft-de.gamepedia.com/' + args.join('_'));
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


var befehle = {
	'advancement':		[
					'/advancement grant <Selektor> everything',
					'/advancement grant <Selektor> from <Fortschritt>',
					'/advancement grant <Selektor> only <Fortschritt> [<Kriterium>]',
					'/advancement grant <Selektor> through <Fortschritt>',
					'/advancement grant <Selektor> until <Fortschritt>',
					'/advancement revoke <Selektor> everything',
					'/advancement revoke <Selektor> from <Fortschritt>',
					'/advancement revoke <Selektor> only <Fortschritt> [<Kriterium>]',
					'/advancement revoke <Selektor> through <Fortschritt>',
					'/advancement revoke <Selektor> until <Fortschritt>'
				],
	'ban':			[
					'/ban <Selektor> [<Grund>]'
				],
	'ban-ip':		[
					'/ban-ip <Selektor> [<Grund>]'
				],
	'banlist':		[
					'/banlist',
					'/banlist ips',
					'/banlist players'
				],
	'bossbar':		[
					'/bossbar create <Name> <Beschriftung>',
					'/bossbar get <Name> max',
					'/bossbar get <Name> players',
					'/bossbar get <Name> value',
					'/bossbar get <Name> visible',
					'/bossbar list',
					'/bossbar remove <Name>',
					'/bossbar set <Name> color <Farbe>',
					'/bossbar set <Name> max <MaxMenge>',
					'/bossbar set <Name> name <Beschriftung>',
					'/bossbar set <Name> players [<Selektor>]',
					'/bossbar set <Name> style <Stil>',
					'/bossbar set <Name> value <Wert>',
					'/bossbar set <Name> visible <Sichtbarkeit>'
				],
	'clear':		[
					'/clear [<Selektor>] [<Gegenstand>] [<MaxMenge>]'
				],
	'clone':		[
					'/clone <x1> <y1> <z1> <x2> <y2> <z2> <x> <y> <z>',
					'/clone <x1> <y1> <z1> <x2> <y2> <z2> <x> <y> <z> filtered <Filterblock> [<Platzierung>]',
					'/clone <x1> <y1> <z1> <x2> <y2> <z2> <x> <y> <z> masked [<Platzierung>]',
					'/clone <x1> <y1> <z1> <x2> <y2> <z2> <x> <y> <z> replace [<Platzierung>]'
				],
	'data':			[
					'/data get block <x> <y> <z> [<Pfad>] [<Skalierung>]',
					'/data get entity <Selektor> [<Pfad>] [<Skalierung>]',
					'/data merge block <x> <y> <z> <NBT-Daten>',
					'/data merge entity <Selektor> <NBT-Daten>',
					'/data remove block <x> <y> <z> <Pfad>',
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
					'/effect clear <Selektor> [<Effekt-ID>]',
					'/effect give <Selektor> <Effekt-ID> [<Zeit in Sekunden>] [<Verstärkung>] [<Partikelunsichtbarkeit>]'
				],
	'enchant':		[
					'/enchant <Selektor> <Verzauberungs-ID> [<Stufe>]'
				],
	'execute':		[
					'/* So kompliziert, diesen Befehl verstehe ich leider noch nicht! */'
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
					'/fill <x1> <y1> <z1> <x2> <y2> <z2> <Block>',
					'/fill <x1> <y1> <z1> <x2> <y2> <z2> <Block> destroy',
					'/fill <x1> <y1> <z1> <x2> <y2> <z2> <Block> hollow',
					'/fill <x1> <y1> <z1> <x2> <y2> <z2> <Block> keep',
					'/fill <x1> <y1> <z1> <x2> <y2> <z2> <Block> outline',
					'/fill <x1> <y1> <z1> <x2> <y2> <z2> <Block> replace [<Filterblock>]'
				],
	'function':		[
					'/function <Funktion>'
				],
	'gamemode':		[
					'/gamemode adventure [<Selektor>]',
					'/gamemode creative [<Selektor>]',
					'/gamemode spectator [<Selektor>]',
					'/gamemode survival [<Selektor>]'
				],
	'gamerule':		[
					'/gamerule <Regel> [<Wert>]'
				],
	'give':			[
					'/give <Selektor> <Gegenstand> [<Anzahl>]'
				],
	'help':			[
					'/help [<Befehl>]'
				],
	'kick':			[
					'/kick <Selektor> [<Grund>]'
				],
	'kill':			[
					'/kill <Selektor>'
				],
	'list':			[
					'/list'
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
					'/particle <Partikel-ID> [<Textur-Parameter>]',
					'/particle <Partikel-ID> [<Textur-Parameter>] <x> <y> <z> <xd> <yd> <zd> <Geschwindigkeit> <Anzahl>',
					'/particle <Partikel-ID> [<Textur-Parameter>] <x> <y> <z> <xd> <yd> <zd> <Geschwindigkeit> <Anzahl> force [<Selektor>]',
					'/particle <Partikel-ID> [<Textur-Parameter>] <x> <y> <z> <xd> <yd> <zd> <Geschwindigkeit> <Anzahl> normal [<Selektor>]'
				],
	'playsound':		[
					'/playsound <Geräusch> <Geräuschart> <Selektor> [<x> <y> <z>] [<Lautstärke>] [<Tonhöhe>] [<Mindestlautstärke>]'
				],
	'publish':		[
					'/publish [<Port>]'
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
					'/replaceitem block <x> <y> <z> <Slot> <Gegenstand> [<Anzahl>]',
					'/replaceitem entity <Selektor> <Slot> <Gegenstand> [<Anzahl>]'
				],
	'save-all':		[
					'/save-all [flush]'
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
					'/scoreboard objectives add <Ziel> <Kriterientyp> [<Anzeigename>]',
					'/scoreboard objectives list',
					'/scoreboard objectives remove <Ziel>',
					'/scoreboard objectives setdisplay <Anzeigeposition> [<Ziel>]',
					'/scoreboard players add <Selektor> <Ziel> <Punkte>',
					'/scoreboard players enable <Selektor> <Ziel>',
					'/scoreboard players get <Selektor> <Ziel>',
					'/scoreboard players list [<Selektor>]',
					'/scoreboard players operation <Selektor> <Ziel> <Operation> <Selektor> <Ziel>',
					'/scoreboard players remove <Selektor> <Ziel> <Punkte>',
					'/scoreboard players reset <Selektor> [<Ziel>]',
					'/scoreboard players set <Selektor> <Ziel> <Punkte>'
				],
	'seed':			[
					'/seed'
				],
	'setblock':		[
					'/setblock <x> <y> <z> <Block> [<Platzierung>]'
				],
	'setidletimeout':	[
					'/setidletimeout <Zeit in Sekunden>'
				],
	'setworldspawn':	[
					'/setworldspawn [<x> <y> <z>]'
				],
	'spawnpoint':		[
					'/spawnpoint [<Selektor>] [<x> <y> <z>]'
				],
	'spreadplayers':	[
					'/spreadplayers <x> <z> <Abstand> <Bereich> <Teamverteilung> <Selektor>'
				],
	'stop':			[
					'/stop'
				],
	'stopsound':		[
					'/stopsound <Selektor> [<Geräuschart>] [<Geräusch>]'
				],
	'summon':		[
					'/summon <Objekt> [<x> <y> <z>] [<NBT-Daten>]'
				],
	'tag':			[
					'/tag <Selektor> add <Name des Etikett>',
					'/tag <Selektor> list',
					'/tag <Selektor> remove <Name des Etikett>'
				],
	'team':			[
					'/team add <Teamname> [<Anzeigename>]',
					'/team empty <Teamname>',
					'/team join <Teamname> [<Selektor>]',
					'/team leave <Selektor>',
					'/team list [<Teamname>]',
					'/team option <Teamname> <Eigenschaft> <Wert>',
					'/team remove <Teamname>'
				],
	'teleport':		[
					'/teleport <Selektor des Zieles>',
					'/teleport <Zielort>',
					'/teleport <Selektor> <Selektor des Zieles>',
					'/teleport <Selektor> <Zielort>',
					'/teleport <Selektor> <Zielort> <Drehung> <Kopfneigung>',
					'/teleport <Selektor> <Zielort> facing <x> <y> <z>',
					'/teleport <Selektor> <Zielort> facing <Selektor im Blick> eyes',
					'/teleport <Selektor> <Zielort> facing <Selektor im Blick> feet'
				],
	'tellraw':		[
					'/tellraw <Selektor> <Nachricht im JSON-Format>'
				],
	'tickingarea':		[
					'/* Diesen Befehl gibt es nur in der Bedrock Edition */',
					'/tickingarea add <von: x y z> <bis: x y z> [<Name: String>]',
					'/tickingarea add circle <Zentrum: x y z> <Radius: int> [<Name: String>]',
					'/tickingarea remove <Name: String>',
					'/tickingarea remove <Position: x y z>',
					'/tickingarea remove_all',
					'/tickingarea list [all-dimensions]'
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
					'/weather clear [<Dauer in Sekunden>]',
					'/weather rain [<Dauer in Sekunden>]',
					'/weather thunder [<Dauer in Sekunden>]'
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
					'/worldborder add <Weite> [<Zeit in Sekunden>]',
					'/worldborder center <x> <z>',
					'/worldborder damage amount <Schaden pro Block>',
					'/worldborder damage buffer <Weite>',
					'/worldborder get',
					'/worldborder set <Weite> [<Zeit in Sekunden>]',
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

function cmd_befehl(msg, befehl, args) {
	var aliasCmd = ( befehl in aliase ) ? aliase[befehl] : befehl;
	
	if ( aliasCmd in befehle ) {
		var cmdSyntax = befehle[aliasCmd].join( '\n' ).replace( '/' + aliasCmd, '/' + befehl );
		msg.channel.send('```markdown\n' + cmdSyntax + '\n```\nhttps://minecraft-de.gamepedia.com/Befehl/' + aliasCmd);
	}
	else {
		msg.react('❓');
	}
}

function cmd_befehl2(msg, args) {
	cmd_befehl(msg, args[0], args.slice(1));
}


client.on('message', msg => {
	var cont = msg.content;
	var author = msg.member;
	var channel = msg.channel;
	if ( channel.type == 'text' && author.id != client.user.id && cont.toLowerCase().startsWith(process.env.prefix) ) {
		var invoke = cont.split(' ')[1].toLowerCase();
		var args = cont.split(' ').slice(2);
		console.log(invoke + ' - ' + args);
		if ( !pause ) {
			if ( invoke in cmdmap ) {
				cmdmap[invoke](msg, args);
			} else if ( invoke.startsWith('/') ) {
				cmd_befehl(msg, invoke.substr(1), args);
			} else {
				var title = cont.split(' ')[1] + (args.length ? '_' : '') + args.join('_');
				
				if ( title.indexOf( '#' ) != -1 ) channel.send( 'https://minecraft-de.gamepedia.com/' + title );
				else {
					var hourglass;
					msg.react('⏳').then( function( reaction ) {
						hourglass = reaction;
						request( {
							uri: 'https://minecraft-de.gamepedia.com/api.php?action=query&format=json&list=search&srsearch=' + title + '&srlimit=2',
							json: true
						}, function( error, response, body ) {
							if ( error || !response || !body ) {
								console.log( 'Error while getting search results: ' + error );
								channel.send( 'https://minecraft-de.gamepedia.com/' + title );
							}
							else {
								if ( body.query.searchinfo.totalhits == 0 ) {
									msg.react('🤷');
								}
								else if ( body.query.searchinfo.totalhits == 1 ) {
									channel.send( 'https://minecraft-de.gamepedia.com/' + encodeURI( body.query.search[0].title.replace( ' ', '_' ) ) );
								}
								else {
									channel.send( 'https://minecraft-de.gamepedia.com/' + encodeURI( body.query.search[0].title.replace( ' ', '_' ) )
										     + '\nNicht das richtige Ergebnis? Nutze `!wiki suche ' + title.replace( '_', ' ' ) + '` für eine Liste mit allen Treffern!' );
								}
							}
							
							if ( hourglass != undefined ) hourglass.remove();
						} );
					} );
				}
			}
		} else if ( pause && author.id == process.env.owner && ( invoke == "pause" || invoke == "stop" || invoke == "say" || invoke == "test" ) ) {
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
