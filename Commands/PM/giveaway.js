const Giveaways = require("./../../Modules/Giveaways.js");
const parseDuration = require("parse-duration");

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
							if(serverDocument.config.blocked.indexOf(msg.author.id)>-1) {
								return;
							}

							const ch = bot.channelSearch(chname, svr);
							if(ch) {
								if(ch.type==0) {
									let channelDocument = serverDocument.channels.id(ch.id);
									if(!channelDocument) {
										serverDocument.channels.push({_id: ch.id});
										channelDocument = serverDocument.channels.id(ch.id);
									}

									if(channelDocument.giveaway.isOngoing) {
										if(channelDocument.giveaway.creator_id==msg.author.id) {
											msg.channel.createMessage(`The ongoing giveaway called **${channelDocument.giveaway.title}** in #${ch.name} is yours! Would you like to end it now and let me choose a winner?`).then(() => {
												bot.awaitMessage(msg.channel.id, msg.author.id, message => {
													if(config.yes_strings.indexOf(message.content.toLowerCase().trim())>-1) {
														const winner = Giveaways.end(bot, svr, serverDocument, ch, channelDocument);
														msg.channel.createMessage(`Alright, giveaway ended. ${winner ? (`The winner was **@${bot.getName(svr, serverDocument, winner)}**`) : "I was unable to choose a winner."}`);
													}
												});
											});
										} else {
											if(channelDocument.giveaway.participant_ids.indexOf(msg.author.id)>-1) {
												msg.channel.createMessage(`You're already enrolled in the giveaway **${channelDocument.giveaway.title}** in #${ch.name} on ${svr.name}. Do you want to disenroll?`).then(() => {
													bot.awaitMessage(msg.channel.id, msg.author.id, message => {
														if(config.yes_strings.indexOf(message.content.toLowerCase().trim())>-1) {
															channelDocument.giveaway.participant_ids.splice(channelDocument.giveaway.participant_ids.indexOf(msg.author.id), 1);
															serverDocument.save(err => {
																if(err) {
																	winston.warn("Failed to save server data for giveaway", {svrid: svr.id, chid: ch.id}, err);
																}
																msg.channel.createMessage("Done. Good luck winning anything...");
															});
														}
													});
												});
											} else {
												msg.channel.createMessage(`There's a giveaway called **${channelDocument.giveaway.title}** going on in #${ch.name}. Do you want to register for a chance to win?`).then(() => {
													bot.awaitMessage(msg.channel.id, msg.author.id, message => {
														if(config.yes_strings.indexOf(message.content.toLowerCase().trim())>-1) {
															channelDocument.giveaway.participant_ids.push(msg.author.id);
															serverDocument.save(err => {
																if(err) {
																	winston.warn("Failed to save server data for giveaway", {svrid: svr.id, chid: ch.id}, err);
																}
																msg.channel.createMessage("Got it!");
															});
														}
													});
												});
											}
										}
									} else {
										if(bot.getUserBotAdmin(svr, serverDocument, member)>serverDocument.config.commands[commandData.name].admin_level) {
											msg.channel.createMessage("What are we giving away? (only the winner gets this)").then(() => {
												bot.awaitMessage(msg.channel.id, msg.author.id, message => {
													const secret = message.content.trim();
													msg.channel.createMessage("Please give the giveaway a name.").then(() => {
														bot.awaitMessage(msg.channel.id, msg.author.id, message => {
															const title = message.content.trim();
															msg.channel.createMessage("Please insert the giveaway length. Type `.` to use the default of 1 hour.").then(() => {
																bot.awaitMessage(msg.channel.id, msg.author.id, message => {
																	let duration = message.content.trim()=="." ? 3600000 : parseDuration(message);
																	
																	const start = () => {
																		Giveaways.start(bot, svr, serverDocument, msg.author, ch, channelDocument, title, secret, duration);
																		msg.channel.createMessage("A giveaway has been started.");
																	};

																	if(duration>0) {
																		start();
																	} else {
																		duration = 3600000;
																		msg.channel.createMessage("I didn't get that, so I used the default value instead...").then(start);
																	}
																});
															});
														});
													});
												});
											});
										} else {
											msg.channel.createMessage(`ACCESS DENIED. You don't have permission to use this command on ${svr.name}`);
										}
									}
								} else {
									msg.channel.createMessage("Can do giveaways in voice channels.");
								}
							} else {
								msg.channel.createMessage(`There's no channel called ${chname} on ${svr.name}`);
							}
						} else {
							msg.channel.createMessage("Something went wrong, if you think this is an error, message an admin.");
						}
					});
				} else {
					msg.channel.createMessage("You must be in server supplied.");
				}
			} else {
				msg.channel.createMessage("Server does not exist or I am not in it.");
			}
			return;
		}
	}
	winston.warn(`Invalid parameters '${suffix}' provided for ${commandData.name} command`, {usrid: msg.author.id});
	msg.channel.createMessage(`🏮 \`${commandData.name} ${commandData.usage}\``);
};
