module.exports = (bot, db, config, winston, userDocument, msg, suffix, commandData) => {
	if(suffix && suffix.indexOf("|")>-1) {
		const svrname = suffix.substring(0, suffix.indexOf("|")).trim();
		const chname = suffix.substring(suffix.indexOf("|")+1).trim();
		if(svrname && chname) {
			const svr = bot.serverSearch(svrname, msg.author, userDocument);
			if(svr) {
				const member = svr.members.get(msg.author.id);
				if(member) {
					db.servers.findOne({_id: svr.id}, (err, serverDocument) => {
						if(!err && serverDocument) {
							if(bot.getUserBotAdmin(svr, serverDocument, member)>0) {
								const ch = bot.channelSearch(chname, svr);
								if(ch) {
									if(ch.type==0) {
										msg.channel.createMessage(`What do you want me to say in #${ch.name} on ${svr.name}?`).then(() => {
											bot.awaitMessage(msg.channel.id, msg.author.id, message => {
												ch.createMessage(message.content).then(() => {
													msg.channel.createMessage(`Cool, check #${ch.name} `);
												}).catch(() => {
													msg.channel.createMessage("Oops, something went wrong. Try resending...");
												});
											});
										});
									} else {
										msg.channel.createMessage("Can't do this in voice.");
									}
								} else {
									msg.channel.createMessage(`There's no channel called ${chname} on ${svr.name} `);
								}
							} else {
								msg.channel.createMessage(`ACCESS DENIED. You don't have permission to use this command on ${svr.name}`);
							}
						} else {
							msg.channel.createMessage("Uh idk something went wrong. blame mongo. *always blame mongo*");
						}
					});
				} else {
					msg.channel.createMessage("You must be in the server.");
				}
			} else {
				msg.channel.createMessage("I need to be in the server or it doesn't exist!");
			}
			return;
		}
	}
	winston.warn(`Invalid parameters '${suffix}' provided for ${commandData.name} command`, {usrid: msg.author.id});
	msg.channel.createMessage(`🗯 \`${commandData.name} ${commandData.usage}\``);
};
