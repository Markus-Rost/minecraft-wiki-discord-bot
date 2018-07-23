const fs = require('fs');

const Discord = require('discord.js');
var request = require('request');

var client = new Discord.Client( {disableEveryone:true} );

var i18n = JSON.parse(fs.readFileSync('i18n.json', 'utf8'));
var langs = {
	'default': i18n.en,
	'287878955078254592': i18n.de,
	'322961504922238978': i18n.de,
	'334056630411067393': i18n.de,
	'373496151028006913': i18n.de,
	'387970842262241280': i18n.de,
	'391913321747447808': i18n.de,
	'393341740217532428': i18n.de,
	'396940651218075649': i18n.de,
	'410395277317373953': i18n.pl,
	'411860234131472385': i18n.de,
	'417255782820872192': i18n.de,
	'422480985603571712': i18n.en,
	'425692306511888384': i18n.de,
	'430968211417202688': i18n.de,
	'433718362506395648': i18n.de,
	'439427347771293717': i18n.en,
	'443042769922031617': i18n.de,
	'447104142729674753': i18n.en,
	'448549361119395850': i18n.de,
	'449166712190009344': i18n.de,
	'450327699404095508': i18n.de,
	'450428509874159616': i18n.fr,
	'452113393113890818': i18n.de,
	'452404998295257088': i18n.de,
	'453885282694201345': i18n.de,
	'454296882982944768': i18n.de,
	'460175800247779328': i18n.de,
	'466908128282148884': i18n.de,
	'467358937084198922': i18n.de
}

var pause = {};


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
	voice: cmd_voice,
	eval: cmd_multiline
}

var multilinecmdmap = {
	say: cmd_say,
	delete: cmd_delete,
	purge: cmd_delete,
	poll: cmd_umfrage,
	eval: cmd_eval
}

var pausecmdmap = {
	test: cmd_test,
	stop: cmd_stop,
	pause: cmd_pause,
	server: cmd_serverlist,
	say: cmd_multiline,
	delete: cmd_multiline,
	purge: cmd_multiline,
	eval: cmd_multiline
}

function cmd_help(lang, msg, args, line) {
	var cmds = lang.help.list;
	if ( args.length ) {
		if ( args[0].toLowerCase() == 'admin' && ( msg.channel.type != 'text' || admin(msg) ) ) {
			if ( args[1] && args[1].toLowerCase() == 'emoji' ) {
				var cmdlist = lang.help.emoji + '\n';
				var emojis = client.emojis;
				var i = 0;
				emojis.forEach( function(emoji) {
					var br = '\t\t';
					if ( i % 3 == 2 ) br = '\n';
					cmdlist += emoji.toString() + '`' + emoji.toString().replace(emoji.name + ':', '') + '`' + br;
					i++;
				} );
				msg.channel.send( cmdlist, {split:true} );
			}
			else {
				var cmdlist = lang.help.admin + '\n';
				for ( var i = 0; i < cmds.length; i++ ) {
					if ( cmds[i].admin && !cmds[i].hide ) {
						cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
					}
				}
				
				msg.channel.send( cmdlist );
			}
		}
		else {
			var cmdlist = ''
			for ( var i = 0; i < cmds.length; i++ ) {
				if ( cmds[i].cmd.split(' ')[0] === args[0].toLowerCase() && !cmds[i].unsearchable && ( msg.channel.type != 'text' || !cmds[i].admin || admin(msg) ) ) {
					cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
				}
			}
			
			if ( cmdlist == '' ) msg.react('❓');
			else msg.channel.send( cmdlist );
		}
	}
	else {
		var cmdlist = lang.help.all + '\n';
		for ( var i = 0; i < cmds.length; i++ ) {
			if ( !cmds[i].hide && !cmds[i].admin ) {
				cmdlist += '🔹 `' + process.env.prefix + cmds[i].cmd + '`\n\t' + cmds[i].desc + '\n';
			}
		}
		
		msg.channel.send( cmdlist );
	}
}

function cmd_say(lang, msg, args, line) {
	if ( admin(msg) ) {
		args = emoji(args);
		var text = args.join(' ');
		if ( args[0] == 'alarm' ) text = '🚨 **' + args.slice(1).join(' ') + '** 🚨';
		var imgs = [];
		var i = 0;
		msg.attachments.forEach( function(img) {
			imgs[i] = {attachment:img.proxyURL,name:img.filename};
			i++;
		} );
		if ( msg.author.id == process.env.owner ) {
			try {
				text = eval( '`' + text + '`' );
			} catch ( error ) {
				console.log( error.name + ': ' + error.message );
			}
		}
		if ( text || imgs[0] ) {
			msg.channel.send( text, {disableEveryone:false,files:imgs} ).then( message => msg.delete(), error => msg.react('440871715938238494') );
		}
	} else {
		msg.react('❌');
	}
}

function cmd_test(lang, msg, args, line) {
	if ( msg.channel.type != 'text' || !pause[msg.guild.id] ) {
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
			var title = 'Technik ' + args.join(' ');
		} else {
			var title = args.join(' ');
		}
		
		cmd_link(lang, msg, title, 'minecraft-technik', 'technik ');
	}
}

function cmd_en(lang, msg, args, line) {
	cmd_link(lang, msg, args.join(' '), 'minecraft', 'en ');
}

function cmd_uwmc(lang, msg, args, line) {
	msg.channel.send( 'https://uwmc.de/' + args.join('-') );
}

function cmd_invite(lang, msg, args, line) {
	if ( args.length && args[0].toLowerCase() == 'minecraft' ) {
		msg.reply( lang.invite.minecraft + '\nhttps://discord.gg/minecraft' );
	} else if ( args.length && args[0].toLowerCase() == '<@' + client.user.id + '>' ) {
		client.generateInvite(268954689).then( invite => msg.reply( lang.invite.bot + '\n<' + invite + '>' ) );
	} else {
		msg.reply( lang.invite.wiki + '\n' + lang.invite.link );
	}
}

function cmd_eval(lang, msg, args, line) {
	if ( msg.author.id == process.env.owner && args.length ) {
		try {
			var text = eval( args.join(' ') );
		} catch ( error ) {
			var text = error.name + ': ' + error.message;
		}
		console.log( text );
		msg.channel.send( '```js\n' + text + '```', {split:{prepend:'```js\n',append:'```'}} ).catch( err => msg.channel.send( '```js\n' + err.name + ': ' + err.message + '```', {split:{prepend:'```js\n',append:'```'}} ) );
	} else if ( msg.channel.type != 'text' || !pause[msg.guild.id] ) {
		msg.react('❌');
	}
}

function cmd_stop(lang, msg, args, line) {
	if ( msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		msg.reply( 'ich schalte mich nun aus!' );
		console.log( 'Ich schalte mich nun aus!' );
		client.destroy();
	} else if ( msg.channel.type != 'text' || !pause[msg.guild.id] ) {
		cmd_link(lang, msg, line.split(' ').slice(1).join(' '), lang.link, '');
	}
}

function cmd_pause(lang, msg, args, line) {
	if ( msg.channel.type == 'text' && msg.author.id == process.env.owner && args[0] == '<@' + client.user.id + '>' ) {
		if ( pause[msg.guild.id] ) {
			msg.reply( 'ich bin wieder wach!' );
			console.log( 'Ich bin wieder wach!' );
			pause[msg.guild.id] = false;
		} else {
			msg.reply( 'ich lege mich nun schlafen!' );
			console.log( 'Ich lege mich nun schlafen!' );
			pause[msg.guild.id] = true;
		}
	} else if ( msg.channel.type != 'text' || !pause[msg.guild.id] ) {
		cmd_link(lang, msg, line.split(' ').slice(1).join(' '), lang.link, '');
	}
}

function cmd_befehl(lang, msg, befehl, args, line) {
	var aliasCmd = ( ( befehl in lang.cmd.aliase ) ? lang.cmd.aliase[befehl] : befehl ).toLowerCase();
	
	if ( aliasCmd in lang.cmd.list ) {
		var regex = new RegExp('/' + aliasCmd, 'g');
		var cmdSyntax = lang.cmd.list[aliasCmd].join( '\n' ).replace( regex, '/' + befehl );
		msg.channel.send( '```markdown\n' + cmdSyntax + '```<https://' + lang.link + '.gamepedia.com/' + lang.cmd.page + aliasCmd + '>', {split:{maxLength:2000,prepend:'```markdown\n',append:'```'}} );
	}
	else {
		msg.react('❓');
		cmd_link(lang, msg, line.split(' ').slice(1).join(' '), lang.link, '');
	}
}

function cmd_befehl2(lang, msg, args, line) {
	if ( args.length ) {
		if ( args[0].startsWith('/') ) cmd_befehl(lang, msg, args[0].substr(1), args.slice(1), line);
		else cmd_befehl(lang, msg, args[0], args.slice(1), line);
	}
	else {
		cmd_link(lang, msg, line.split(' ').slice(1).join(' '), lang.link, '');
	}
}

function cmd_delete(lang, msg, args, line) {
	if ( admin(msg) ) {
		if ( /^\d+$/.test(args[0]) && parseInt(args[0], 10) + 1 > 0 ) {
			if ( parseInt(args[0], 10) > 99 ) {
				msg.reply( lang.delete.big.replace( '%s', '`99`' ) );
			}
			else {
				msg.channel.bulkDelete(parseInt(args[0], 10) + 1, true).then( messages => {
					msg.reply( lang.delete.success.replace( '%s', messages.size - 1 ) ).then( antwort => antwort.delete(3000) );
					console.log( 'Die letzten ' + ( messages.size - 1 ) + ' Nachrichten in #' + msg.channel.name + ' wurden gelöscht!' );
				} );
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
	var invoke = title.split(' ')[0].toLowerCase();
	var args = title.split(' ').slice(1);
	
	if ( invoke == 'page' || invoke == lang.search.page ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + args.join('_') );
	else if ( invoke == 'search' || invoke == lang.search.search ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/Special:Search/' + args.join('_') );
	else if ( invoke == 'diff' ) cmd_diff(lang, msg, args, wiki);
	else if ( title == '' || title.indexOf( '#' ) != -1 || title.indexOf( '?' ) != -1 ) msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title.replace( / /g, '_' ) );
	else if ( invoke == 'user' || invoke == lang.search.user.unknown || invoke == lang.search.user.male || invoke == lang.search.user.female ) cmd_user(lang, msg, args.join('_'), wiki, title.replace( / /g, '_' ));
	else if ( invoke.startsWith('user:') ) cmd_user(lang, msg, title.substr(5), wiki, title.replace( / /g, '_' ));
	else if ( invoke.startsWith('userprofile:') ) cmd_user(lang, msg, title.substr(12), wiki, title.replace( / /g, '_' ));
	else if ( invoke.startsWith(lang.search.user.unknown + ':') ) cmd_user(lang, msg, title.substr(lang.search.user.unknown.length + 1), wiki, title.replace( / /g, '_' ));
	else if ( invoke.startsWith(lang.search.user.male + ':') ) cmd_user(lang, msg, title.substr(lang.search.user.male.length + 1), wiki, title.replace( / /g, '_' ));
	else if ( invoke.startsWith(lang.search.user.female + ':') ) cmd_user(lang, msg, title.substr(lang.search.user.female.length + 1), wiki, title.replace( / /g, '_' ));
	else {
		var hourglass;
		msg.react('⏳').then( function( reaction ) {
			hourglass = reaction;
			request( {
				uri: 'https://' + wiki + '.gamepedia.com/api.php?action=query&format=json&meta=siteinfo&siprop=interwikimap&redirects=true&titles=' + encodeURI( title ),
				json: true
			}, function( error, response, body ) {
				if ( error || !response || !body || !body.query ) {
					console.log( 'Fehler beim Erhalten der Suchergebnisse' + ( error ? ': ' + error.message : ( body ? ( body.error ? ': ' + body.error.info : '.' ) : '.' ) ) );
					msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title.replace( / /g, '_' ) ).then( message => message.react('440871715938238494') );
				}
				else {
					if ( body.query.pages ) {
						if ( body.query.pages['-1'] && body.query.pages['-1'].missing != undefined ) {
							request( {
								uri: 'https://' + wiki + '.gamepedia.com/api.php?action=query&format=json&list=search&srnamespace=0|4|6|10|12|14&srsearch=' + encodeURI( title ) + '&srlimit=1',
								json: true
							}, function( srerror, srresponse, srbody ) {
								if ( srerror || !srresponse || !srbody || !srbody.query || ( !srbody.query.search[0] && srbody.query.searchinfo.totalhits != 0 ) ) {
									console.log( 'Fehler beim Erhalten der Suchergebnisse' + ( srerror ? ': ' + srerror.message : ( srbody ? ( srbody.error ? ': ' + srbody.error.info : '.' ) : '.' ) ) );
									msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title.replace( / /g, '_' ) ).then( message => message.react('440871715938238494') );
								}
								else {
									if ( srbody.query.searchinfo.totalhits == 0 ) {
										msg.react('🤷');
									}
									else if ( srbody.query.searchinfo.totalhits == 1 ) {
										msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + srbody.query.search[0].title.replace( / /g, '_' ) + '\n' + lang.search.infopage.replace( '%s', '`' + process.env.prefix + cmd + lang.search.page + ' ' + title + '`' ) );
									}
									else {
										msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + srbody.query.search[0].title.replace( / /g, '_' ) + '\n' + lang.search.infosearch.replace( '%1$s', '`' + process.env.prefix + cmd + lang.search.page + ' ' + title + '`' ).replace( '%2$s', '`' + process.env.prefix + cmd + lang.search.search + ' ' + title + '`' ) );
									}
								}
							} );
						}
						else {
							msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + ( Object.values(body.query.pages)[0].title + ( body.query.redirects && body.query.redirects[0].tofragment ? '#' + encodeURI( body.query.redirects[0].tofragment ) : '' ) ).replace( / /g, '_' ) );
						}
					}
					else if ( body.query.interwiki ) {
						var inter = body.query.interwiki[0];
						var intertitle = inter.title.substr(inter.iw.length+1);
						var regex = /^(?:https?:)?\/\/(.*)\.gamepedia\.com\//
						var entry = body.query.interwikimap;
						for ( var i = 0; i < entry.length; i++ ) {
							if ( entry[i].prefix == inter.iw ) {
								if ( regex.test(entry[i].url) ) {
									var iwtitle = entry[i].url.replace( '$1', intertitle ).replace( regex.exec(entry[i].url)[0], '' );
									var link = regex.exec(entry[i].url)[1];
									cmd_link(lang, msg, iwtitle, link, '!' + link + ' ');
								}
								else msg.channel.send( entry[i].url.replace( '$1', intertitle.replace( / /g, '_' ) ) );
								break;
							}
						}
					}
					else {
						msg.react('🤷');
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
			serverlist += '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() + ' (' + guild.id + ')\n\n';
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
	} else if ( msg.channel.type != 'text' || !pause[msg.guild.id] ) {
		cmd_link(lang, msg, line.split(' ').slice(1).join(' '), lang.link, '');
	}
}

function cmd_umfrage(lang, msg, args, line) {
	if ( admin(msg) ) {
		var imgs = [];
		var a = 0;
		msg.attachments.forEach( function(img) {
			imgs[a] = {attachment:img.proxyURL,name:img.filename};
			a++;
		} );
		if ( args.length || imgs[0] ) {
			var reactions = [];
			args = emoji(args);
			for ( var i = 0; ( i < args.length || imgs[0] ); i++ ) {
				var reaction = args[i];
				var custom = /^<a?:/;
				var pattern = /^[\w\säÄöÖüÜßẞ!"#$%&'()*+,./:;<=>?@^`{|}~–[\]\-\\]{2,}/;
				if ( !custom.test(reaction) && pattern.test(reaction) ) {
					cmd_sendumfrage(lang, msg, args, reactions, imgs, i);
					break;
				} else if ( reaction == '' ) {
				} else {
					if ( custom.test(reaction) ) {
						reaction = reaction.substring(reaction.lastIndexOf(':')+1, reaction.length-1);
					}
					reactions[i] = reaction;
					if ( i == args.length-1 ) {
						cmd_sendumfrage(lang, msg, args, reactions, imgs, i+1);
						break;
					}
				}
			}
		} else {
			args[0] = line.split(' ')[1];
			cmd_help(lang, msg, args, line);
		}
	} else {
		msg.react('❌');
	}
}

function cmd_sendumfrage(lang, msg, args, reactions, imgs, i) {
	msg.channel.send( lang.poll.title + args.slice(i).join(' '), {disableEveryone:false,files:imgs} ).then( poll => {
		msg.delete();
		if ( reactions.length ) {
			reactions.forEach( function(entry) {
				poll.react(entry).catch( error => poll.react('440871715938238494') );
			} );
		} else {
			poll.react('448222377009086465');
			poll.react('448222455425794059');
		}
	}, error => msg.react('440871715938238494') );
}

function cmd_user(lang, msg, username, wiki, title) {
	if ( !username || username.indexOf( '/' ) != -1 || username.toLowerCase().startsWith('talk:') || username.toLowerCase().startsWith(lang.user.talk) ) {
		msg.channel.send( 'https://' + wiki + '.gamepedia.com/' + title );
	} else {
		var hourglass;
		msg.react('⏳').then( function( reaction ) {
			hourglass = reaction;
			request( {
				uri: 'https://' + wiki + '.gamepedia.com/api.php?action=query&format=json&list=users&usprop=blockinfo|groups|editcount|registration|gender&ususers=' + encodeURI( username ),
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
						username = body.query.users[0].name.replace( / /g, '_' );
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
						msg.channel.send( '<https://' + wiki + '.gamepedia.com/UserProfile:' + username + '>\n\n' + lang.user.info.replace( '%1$s', gender ).replace( '%2$s', registration ).replace( '%3$s', editcount ).replace( '%4$s', group ) + ( blockid ? '\n\n' + lang.user.blocked.replace( '%1$s', blockedtimestamp ).replace( '%2$s', blockexpiry ).replace( '%3$s', blockedby ).replace( '%4$s', blockreason ) : '' ) );
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
	if ( args[0] == '<@' + client.user.id + '>' ) {
		msg.reply( lang.bug.text + '\nhttps://discord.gg/v77RTk5' );
	}
	else if ( args.length && /\d+$/.test(args[0]) ) {
		var hourglass;
		msg.react('⏳').then( function( reaction ) {
			hourglass = reaction;
			var project = '';
			if ( /^\d+$/.test(args[0]) ) project = 'MC-';
			request( {
				uri: 'https://bugs.mojang.com/rest/api/2/issue/' + project + args[0] + '?fields=summary',
				json: true
			}, function( error, response, body ) {
				if ( error || !response || !body ) {
					console.log( 'Fehler beim Erhalten der Zusammenfassung' + ( error ? ': ' + error.message : '.' ) );
					msg.channel.send( 'https://bugs.mojang.com/browse/' + project + args[0] ).then( message => message.react('440871715938238494') );
				}
				else {
					if ( body.errorMessages || body.errors ) {
						if ( body.errorMessages && body.errorMessages[0] == 'Issue Does Not Exist' ) {
							msg.react('❓');
						}
						else {
							msg.channel.send( lang.bug.private + '\nhttps://bugs.mojang.com/browse/' + project + args[0] );
						}
					}
					else {
						msg.channel.send( body.fields.summary + '\nhttps://bugs.mojang.com/browse/' + body.key );
					}
				}
				
				if ( hourglass != undefined ) hourglass.remove();
			} );
		} );
	}
	else {
		cmd_link(lang, msg, line.split(' ').slice(1).join(' '), lang.link, '');
	}
}

function cmd_voice(lang, msg, args, line) {
	if ( admin(msg) ) {
		msg.reply( lang.voice.text + '\n`' + lang.voice.channel + ' – <' + lang.voice.name + '>`' );
	} else if ( msg.channel.type != 'text' || !pause[msg.guild.id] ) {
		cmd_link(lang, msg, line.split(' ').slice(1).join(' '), lang.link, '');
	}
}

function admin(msg) {
	if ( msg.channel.type == 'text' && ( msg.member.permissions.has('MANAGE_GUILD') || msg.author.id == process.env.owner ) ) return true;
	else return false;
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
	if ( cont.toLowerCase().indexOf( process.env.prefix ) != -1 && !msg.webhookID && author.id != client.user.id && ( channel.type != 'text' || channel.permissionsFor(client.user).has(['SEND_MESSAGES','ADD_REACTIONS','USE_EXTERNAL_EMOJIS']) ) ) {
		var lang = langs['default'];
		if ( channel.type == 'text' && msg.guild.id in langs ) lang = langs[msg.guild.id];
		var invoke = cont.split(' ')[1].toLowerCase();
		var aliasInvoke = ( invoke in lang.aliase ) ? lang.aliase[invoke] : invoke;
		if ( cont.toLowerCase().startsWith(process.env.prefix) && aliasInvoke in multilinecmdmap ) {
			if ( channel.type != 'text' || channel.permissionsFor(client.user).has('MANAGE_MESSAGES') ) {
				var args = cont.split(' ').slice(2);
				console.log((msg.guild ? msg.guild.name : '@' + author.username) + ': ' + invoke + ' - ' + args);
				if ( channel.type != 'text' || !pause[msg.guild.id] || ( author.id == process.env.owner && aliasInvoke in pausecmdmap ) ) multilinecmdmap[aliasInvoke](lang, msg, args, cont);
			} else {
				msg.reply( lang.missingperm + ' `MANAGE_MESSAGES`' );
			}
		} else {
			cont.split('\n').forEach( function(line) {
				if ( line.toLowerCase().startsWith(process.env.prefix) ) {
					invoke = line.split(' ')[1].toLowerCase();
					var args = line.split(' ').slice(2);
					aliasInvoke = ( invoke in lang.aliase ) ? lang.aliase[invoke] : invoke;
					console.log((msg.guild ? msg.guild.name : '@' + author.username) + ': ' + invoke + ' - ' + args);
					if ( channel.type != 'text' || !pause[msg.guild.id] ) {
						if ( aliasInvoke in cmdmap ) cmdmap[aliasInvoke](lang, msg, args, line);
						else if ( invoke.startsWith('/') ) cmd_befehl(lang, msg, invoke.substr(1), args, line);
						else if ( invoke.startsWith('!') ) cmd_link(lang, msg, args.join(' '), invoke.substr(1), invoke + ' ');
						else cmd_link(lang, msg, line.split(' ').slice(1).join(' '), lang.link, '');
					} else if ( channel.type == 'text' && pause[msg.guild.id] && author.id == process.env.owner && aliasInvoke in pausecmdmap ) {
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
		if ( oldm.voiceChannel ) {
			var oldrole = oldm.guild.roles.find('name', lang.voice.channel + ' – ' + oldm.voiceChannel.name);
			if ( oldrole && oldrole.comparePositionTo(oldm.guild.me.highestRole) < 0 ) {
				oldm.removeRole( oldrole, lang.voice.left.replace( '%1$s', oldm.displayName ).replace( '%2$s', oldm.voiceChannel.name ) );
				console.log( oldm.guild.name + ': ' + oldm.displayName + ' hat den Sprachkanal "' + oldm.voiceChannel.name + '" verlassen.' );
			}
		}
		if ( newm.voiceChannel ) {
			var newrole = newm.guild.roles.find('name', lang.voice.channel + ' – ' + newm.voiceChannel.name);
			if ( newrole && newrole.comparePositionTo(newm.guild.me.highestRole) < 0 ) {
				newm.addRole( newrole, lang.voice.join.replace( '%1$s', newm.displayName ).replace( '%2$s', newm.voiceChannel.name ) );
				console.log( newm.guild.name + ': ' + newm.displayName + ' hat den Sprachkanal "' + newm.voiceChannel.name + '" betreten.' );
			}
		}
	}
});


client.on('guildCreate', guild => {
	client.fetchUser(process.env.owner).then( owner => owner.send( 'Ich wurde zu einem Server hinzugefügt:\n\n' + '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() + ' (' + guild.id + ')' ) );
	console.log( 'Ich wurde zu einem Server hinzugefügt.' );
});

client.on('guildDelete', guild => {
	client.fetchUser(process.env.owner).then( owner => owner.send( 'Ich wurde von einem Server entfernt:\n\n' + '"' + guild.toString() + '" von ' + guild.owner.toString() + ' mit ' + guild.memberCount + ' Mitgliedern\n' + guild.channels.find('type', 'text').toString() + ' (' + guild.id + ')' ) );
	console.log( 'Ich wurde von einem Server entfernt.' );
});


client.login(process.env.token);
