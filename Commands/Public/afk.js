
module.exports = (bot, db, config, winston, userDocument, serverDocument, channelDocument, memberDocument, msg, suffix, commandData) => {
	if(suffix) {
		if(suffix==".") {
			memberDocument.afk_message = null;
			msg.channel.createMessage("Your AFK message has been removed.");
		} else {
			memberDocument.afk_message = suffix;
			msg.channel.createMessage(`I'll show your message when someone mentions you. Use \`${bot.getCommandPrefix(msg.guild, serverDocument)}${commandData.name} .\` to remove it.`);
		}
	} else {
		if(memberDocument.afk_message) {
			msg.channel.createMessage(`You have the AFK message \`${memberDocument.afk_message}\` set on this server.`);
		} else {
			msg.channel.createMessage("You don't have an AFK message set.");
		}
	}
};
