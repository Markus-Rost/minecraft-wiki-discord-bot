const fs = require('fs');

const Discord = require('discord.js');
var request = require('request');

var client = new Discord.Client();

var i18n = JSON.parse(fs.readFileSync('i18n.json', 'utf8'));
var langs = {
	'default': i18n.de,
	'447104142729674753': i18n.en,
	'422480985603571712': i18n.en,
	'439427347771293717': i18n.en,
	'450428509874159616': i18n.fr
}

var pause = false;


client.on('ready', () => {
	console.log( 'Erfolgreich als ' + client.user.username + ' angemeldet!' );
	client.user.setActivity('Minecraft Wiki');
});


var cmdmap = {
	help: cmd_help,
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
	poll: cmd_multiline,
	bug: cmd_bug,
	message: cmd_multiline
}

var multilinecmdmap = {
	say: cmd_say,
	delete: cmd_delete,
	purge: cmd_delete,
	poll: cmd_umfrage,
	message: cmd_message
}

var pausecmdmap = {
	test: cmd_test,
	stop: cmd_stop,
	pause: cmd_pause,
	server: cmd_serverlist,
	say: cmd_multiline,
	delete: cmd_multiline,
	purge: cmd_multiline,
	message: cmd_multiline
}

function cmd_help(lang, msg, args, line) {
	var cmds = lang.help.list;
	if ( args.length ) {
		if ( args[0].toLowerCase() == 'admin' && ( msg.channel.type != 'text' || msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
			if ( args[1] && args[1].toLowerCase() == 'emoji' ) {
				var cmdlist = lang.help.emoji + '\n';
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
				var cmdlist = lang.help.admin + '\n';
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
		var cmdlist = lang.help.all + '\n';
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
			msg.channel.send( '🚨 **' + args.slice(1).join(' ') + '** 🚨' );
		} else {
			msg.channel.send( args.join(' ') );
		}
		msg.delete();
	} else {
		msg.react('❌');
	}
}

function cmd_test(lang, msg, args, line) {
	if ( !pause ) {
		var text = '';
		var x = Math.floor(Math.random() * lang.test.random);
		if ( x < lang.test.text.length ) text = lang.test.text[x];
		else text = lang.test.default;
		msg.reply( text );
		console.log( 'Dies ist ein Test: Voll funktionsfähig!' );
	} else {
		msg.reply( lang.test.pause );
		console.log( 'Dies ist ein Test: Pausiert!' );
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
	msg.channel.send( 'https://uwmc.de/' + args.join('-') );
}

function cmd_invite(lang, msg, args, line) {
	if ( args.length && args[0].toLowerCase() == 'minecraft' ) {
		msg.reply( lang.invite.minecraft + '\nhttps://discord.gg/minecraft' );
	} else if ( args.length && args[0].toLowerCase() == '<@' + client.user.id + '>' ) {
		client.generateInvite(268823617).then( invite => msg.reply( lang.invite.bot + '\n<' + invite + '>' ) );
	} else {
		msg.reply( lang.invite.wiki );
	}
}

function cmd_stop(lang, msg, args, line) {
	if ( msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		msg.reply( 'ich schalte mich nun aus!' );
		console.log( 'Ich schalte mich nun aus!' );
		client.destroy();
	} else if ( !pause ) {
		cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), lang.link, '');
	}
}

function cmd_pause(lang, msg, args, line) {
	if ( msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		if ( pause ) {
			msg.reply( 'ich bin wieder wach!' );
			console.log( 'Ich bin wieder wach!' );
			pause = false;
			client.user.setStatus('online');
		} else {
			msg.reply( 'ich lege mich nun schlafen!' );
			console.log( 'Ich lege mich nun schlafen!' );
			pause = true;
			client.user.setStatus('invisible');
		}
	} else if ( !pause ) {
		cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), lang.link, '');
	}
}

function cmd_befehl(lang, msg, befehl, args) {
	var aliasCmd = ( ( befehl in lang.cmd.aliase ) ? lang.cmd.aliase[befehl] : befehl ).toLowerCase();
	
	if ( aliasCmd in lang.cmd.list ) {
		var regex = new RegExp('/' + aliasCmd, 'g');
		var cmdSyntax = lang.cmd.list[aliasCmd].join( '\n' ).replace( regex, '/' + befehl );
		msg.channel.send( '```markdown\n' + cmdSyntax + '```<https://' + lang.link + '.gamepedia.com/' + lang.cmd.page + aliasCmd + '>', {split:{prepend:'```markdown\n',append:'```'}} );
	}
	else {
		msg.react('❓');
	}
}

function cmd_befehl2(lang, msg, args, line) {
	if ( args.length ) {
		if ( args[0].startsWith('/') ) cmd_befehl(lang, msg, args[0].substr(1), args.slice(1));
		else cmd_befehl(lang, msg, args[0], args.slice(1));
	}
	else {
		cmd_link(lang, msg, line.split(' ')[1], lang.link, '');
	}
}

function cmd_delete(lang, msg, args, line) {
	if ( msg.channel.type == 'text' && ( msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) {
		if ( parseInt(args[0], 10) + 1 > 0 ) {
			if ( parseInt(args[0], 10) > 99 ) {
				msg.reply( lang.delete.big.replace( '%s', '`99`' ) );
			}
			else {
				msg.channel.bulkDelete(parseInt(args[0], 10) + 1, true);
				msg.reply( lang.delete.success.replace( '%s', args[0] ) ).then( antwort => antwort.delete(3000) );
				console.log( 'Die letzten ' + args[0] + ' Nachrichten in #' + msg.channel.name + ' wurden gelöscht!' );
			}
		}
		else {
			msg.reply( lang.delete.invalid );
		}
	} else {
		msg.react('❌');
	}
}

function cmd_link(lang, msg, title, wiki, cmd) {
	var invoke = title.split('_')[0].toLowerCase();
	var args = title.split('_').slice(1);
	
	if ( invoke == 'page' || invoke == lang.search.page ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + args.join('_') );
	else if ( invoke == 'search' || invoke == lang.search.search ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/Special:Search/' + args.join('_') );
	else if ( invoke == 'diff' ) cmd_diff(lang, msg, args, wiki);
	else if ( title == '' || title.indexOf( '#' ) != -1 || title.indexOf( '?' ) != -1 ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title );
	else if ( invoke == 'user' || invoke == lang.search.user.unknown || invoke == lang.search.user.male || invoke == lang.search.user.female ) cmd_user(lang, msg, args.join('_'), wiki, title);
	else if ( invoke.startsWith('user:') ) cmd_user(lang, msg, title.substr(5), wiki, title);
	else if ( invoke.startsWith('userprofile:') ) cmd_user(lang, msg, title.substr(12), wiki, title);
	else if ( invoke.startsWith(lang.search.user.unknown + ':') ) cmd_user(lang, msg, title.substr(lang.search.user.unknown.length + 1), wiki, title);
	else if ( invoke.startsWith(lang.search.user.male + ':') ) cmd_user(lang, msg, title.substr(lang.search.user.male.length + 1), wiki, title);
	else if ( invoke.startsWith(lang.search.user.female + ':') ) cmd_user(lang, msg, title.substr(lang.search.user.female.length + 1), wiki, title);
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
						msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + encodeURI( body.query.search[0].title.replace( / /g, '_' ) ) + '\n' + lang.search.info.replace( '%1$s', '`' + process.env.prefix + cmd + lang.search.search + ' ' + title.replace( /_/g, ' ' ) + '`' ).replace( '%2$s', '`' + process.env.prefix + cmd + lang.search.page + ' ' + title.replace( /_/g, ' ' ) + '`' ) );
					}
				}
				
				if ( hourglass != undefined ) hourglass.remove();
			} );
		} );
	}
}

function cmd_info(lang, msg, args, line) {
	if ( msg.channel.type == 'text' && msg.channel.permissionsFor(client.user).has('MANAGE_ROLES') && msg.guild.roles.find('name', 'Entwicklungsversion') ) {
		if ( msg.member.roles.find('name', 'Entwicklungsversion') ) {
			msg.member.removeRole( msg.member.guild.roles.find('name', 'Entwicklungsversion'), msg.member.displayName + ' wird nun nicht mehr bei neuen Entwicklungsversionen benachrichtigt.' );
			console.log( msg.member.displayName + ' wird nun nicht mehr bei neuen Entwicklungsversionen benachrichtigt.' );
			msg.react('🔕');
		}
		else {
			msg.member.addRole( msg.member.guild.roles.find('name', 'Entwicklungsversion'), msg.member.displayName + ' wird nun bei neuen Entwicklungsversionen benachrichtigt.' );
			console.log( msg.member.displayName + ' wird nun bei neuen Entwicklungsversionen benachrichtigt.' );
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
		msg.author.send( serverlist, {split:{char:'\n\n'}} );
	} else if ( msg.author.id == process.env.owner && args.join(' ') == 'list all <@' + client.user.id + '> permissions' ) {
		var guilds = client.guilds;
		var serverlist = 'Ich befinde mich aktuell auf ' + guilds.size + ' Servern:\n\n';
		guilds.forEach( function(guild) {
			var perms = '  ';
			var allperms = Object.entries(guild.me.permissions.serialize());
			allperms.forEach( function(perm) {
				if ( perm[1] ) perms += perm[0] + ', ';
			} );
			perms = perms.substr(0, perms.length -2);
			serverlist += '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() + perms + '\n\n';
		} );
		msg.author.send( serverlist, {split:{char:'\n\n'}} );
	} else if ( msg.author.id == process.env.owner && args.join(' ') == 'list all <@' + client.user.id + '> members' ) {
		var guilds = client.guilds;
		var serverlist = 'Ich befinde mich aktuell auf ' + guilds.size + ' Servern:\n\n';
		guilds.forEach( function(guild) {
			var members = '  ';
			var allmembers = guild.members;
			if ( !allmembers.has(process.env.owner) && guild.memberCount < 50 ) {
				allmembers.forEach( function(member) {
					members += member.toString() + ', ';
				} );
			}
			members = members.substr(0, members.length -2);
			serverlist += '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() + members + '\n\n';
		} );
		msg.author.send( serverlist, {split:{char:'\n\n'}} );
	} else if ( !pause ) {
		cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), lang.link, '');
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
					msg.channel.send( lang.poll.title + args.slice(i).join(' ') ).then( poll => {
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
			msg.reply( lang.poll.help.replace( '%s', process.env.prefix + line.split(' ')[1] ) );
		}
	} else {
		msg.react('❌');
	}
}

function cmd_user(lang, msg, username, wiki, title) {
	if ( !username || username.indexOf( '/' ) != -1 || username.toLowerCase().startsWith('talk:') || username.toLowerCase().startsWith(lang.user.talk) ) {
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
					msg.channel.send( '<https://' + wiki + '.gamepedia.com/User:' + username + '>' ).then( message => message.react('440871715938238494') );
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
						switch (gender) {
							case 'male':
								gender = lang.user.gender.male;
								break;
							case 'female':
								gender = lang.user.gender.female;
								break;
							default: 
								gender = lang.user.gender.unknown;
						}
						var registration = (new Date(body.query.users[0].registration)).toLocaleString(lang.user.dateformat, options);
						var editcount = body.query.users[0].editcount;
						var groups = body.query.users[0].groups;
						var group = '';
						for ( var i = 0; i < lang.user.group.length; i++ ) {
							if ( groups.includes(lang.user.group[i][0]) ) {
								group = lang.user.group[i][1];
								break;
							}
						}
						var blockid = body.query.users[0].blockid;
						var blockedtimestamp = (new Date(body.query.users[0].blockedtimestamp)).toLocaleString(lang.user.dateformat, options);
						var blockexpiry = body.query.users[0].blockexpiry;
						if ( blockexpiry == 'infinity' ) {
							blockexpiry = lang.user.until_infinity;
						} else if ( blockexpiry ) {
							blockexpiry = (new Date(blockexpiry.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2,3})/, '$1-$2-$3T$4:$5:$6Z'))).toLocaleString(lang.user.dateformat, options);
						}
						var blockedby = body.query.users[0].blockedby;
						var blockreason = body.query.users[0].blockreason;
						msg.channel.send( '<https://' + wiki + '.gamepedia.com/UserProfile:' + username + '>\n\n' + lang.user.info.replace( '%1$s', gender ).replace( '%2$s', registration ).replace( '%3$s', editcount ).replace( '%4$s', group ) + ( blockid ? '\n\n' + lang.user.blocked.replace( '%1$s', blockedtimestamp ).replace( '%2$s', blockexpiry ).replace( '%3$s', blockedby ).replace( '%4$s', blockreason ) : '' ));
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
		cmd_link(lang, msg, line.split(' ')[1], lang.link, '');
	}
}

function cmd_message(lang, msg, args, line) {
	if ( msg.author.id == process.env.owner && args[1] && args[0] == '<@' + client.user.id + '>' ) {
		client.guilds.forEach( function(guild) {
			guild.owner.send( guild.toString() + ':\n' + args.slice(1).join(' ') + '\n~<@' + process.env.owner + '>' );
		} );
	} else if ( !pause ) {
		cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), lang.link, '');
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
	var lang = langs['default'];
	if ( msg.channel.type == 'text' && msg.guild.id in langs ) lang = langs[msg.guild.id];
	if ( !msg.webhookID && author.id != client.user.id && ( msg.channel.type != 'text' || channel.permissionsFor(client.user).has('SEND_MESSAGES') ) ) {
		if ( cont.toLowerCase().startsWith(process.env.prefix) && cont.split(' ')[1].toLowerCase() in multilinecmdmap ) {
			if ( ( msg.channel.type != 'text' || channel.permissionsFor(client.user).has('MANAGE_MESSAGES') ) ) {
				var invoke = cont.split(' ')[1].toLowerCase();
				var args = cont.split(' ').slice(2);
				var aliasInvoke = ( invoke in lang.aliase ) ? lang.aliase[invoke] : invoke;
				console.log((msg.guild ? msg.guild.name : '@' + author.username) + ': ' + invoke + ' - ' + args);
				if ( !pause || ( author.id == process.env.owner && aliasInvoke in pausecmdmap ) ) multilinecmdmap[aliasInvoke](lang, msg, args, cont);
			} else {
				msg.reply( lang.missingperm );
			}
		} else {
			cont.split('\n').forEach( function(line) {
				if ( line.toLowerCase().startsWith(process.env.prefix) ) {
					var invoke = line.split(' ')[1].toLowerCase();
					var args = line.split(' ').slice(2);
					var aliasInvoke = ( invoke in lang.aliase ) ? lang.aliase[invoke] : invoke;
					console.log((msg.guild ? msg.guild.name : '@' + author.username) + ': ' + invoke + ' - ' + args);
					if ( !pause ) {
						if ( aliasInvoke in cmdmap ) cmdmap[aliasInvoke](lang, msg, args, line);
						else if ( invoke.startsWith('/') ) cmd_befehl(lang, msg, invoke.substr(1), args);
						else if ( invoke.startsWith('!') ) cmd_link(lang, msg, args.join('_'), invoke.substr(1), invoke + ' ');
						else cmd_link(lang, msg, line.split(' ')[1] + (args.length ? '_' : '') + args.join('_'), lang.link, '');
					} else if ( pause && author.id == process.env.owner && aliasInvoke in pausecmdmap ) {
						pausecmdmap[aliasInvoke](lang, msg, args, line);
					}
				}
			} );
		}
	}
});


client.on('voiceStateUpdate', (oldm, newm) => {
	var lang = langs['default'];
	if ( oldm.guild.id in langs ) lang = langs[oldm.guild.id];
	if ( oldm.guild.me.permissions.has('MANAGE_ROLES') && oldm.voiceChannelID != newm.voiceChannelID ) {
		if ( oldm.voiceChannel && oldm.guild.roles.find('name', lang.voice.channel + ' – ' + oldm.voiceChannel.name) ) {
			oldm.removeRole( oldm.guild.roles.find('name', lang.voice.channel + ' – ' + oldm.voiceChannel.name), lang.voice.left.replace( '%1$s', oldm.displayName ).replace( '%2$s', oldm.voiceChannel.name ) );
			console.log( oldm.guild.name + ': ' + oldm.displayName + ' hat den Sprachkanal "' + oldm.voiceChannel.name + '" verlassen.' );
		}
		if ( newm.voiceChannel && newm.guild.roles.find('name', lang.voice.channel + ' – ' + newm.voiceChannel.name) ) {
			newm.addRole( newm.guild.roles.find('name', lang.voice.channel + ' – ' + newm.voiceChannel.name), lang.voice.join.replace( '%1$s', newm.displayName ).replace( '%2$s', newm.voiceChannel.name ) );
			console.log( newm.guild.name + ': ' + newm.displayName + ' hat den Sprachkanal "' + newm.voiceChannel.name + '" betreten.' );
		}
	}
});


client.on('guildCreate', guild => {
	client.fetchUser(process.env.owner).then( owner => owner.send( 'Ich wurde zu einem Server hinzugefügt:\n\n' + '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() ) );
	console.log( 'Ich wurde zu einem Server hinzugefügt.' );
});

client.on('guildDelete', guild => {
	client.fetchUser(process.env.owner).then( owner => owner.send( 'Ich wurde von einem Server entfernt:\n\n' + '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() ) );
	console.log( 'Ich wurde von einem Server entfernt.' );
});


client.login(process.env.token);
