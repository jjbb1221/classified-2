module.exports = (bot, db, config, winston, userDocument, serverDocument, channelDocument, memberDocument, msg, suffix, commandData) => {
	let member;
	if(!suffix || suffix.toLowerCase()=="me") {
		member = msg.member;
	} else {
		member = bot.memberSearch(suffix, msg.guild);
	}
	if(member) {
		msg.channel.createMessage(member.user.avatarURL || member.user.defaultAvatarURL);
	} else {
		winston.warn(`Requested member does not exist so ${commandData.name} cannot be shown`, {svrid: msg.guild.id, chid: msg.channel.id, usrid: msg.author.id});
		msg.channel.createMessage(`Couldn' find them, so here is meh!\n${bot.user.avatarURL || bot.user.defaultAvatarURL}`);
	}
};
