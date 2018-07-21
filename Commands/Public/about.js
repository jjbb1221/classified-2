module.exports = (bot, db, config, winston, userDocument, serverDocument, channelDocument, memberDocument, msg, suffix) => {
	if(suffix && ["bug", "suggestion", "feature", "issue"].indexOf(suffix.toLowerCase())>-1) {
		msg.channel.createMessage(`Please file your ${suffix.toLowerCase()} here: https://github.com/jjbb1221/classified-2/issues/new`);
	} else {
		msg.channel.createMessage(`Hello im Kosh Systems, the perfect bot for Discord. Use \`${bot.getCommandPrefix(msg.guild, serverDocument)}help\` to list commands. Created by RedstoneClaw101 and Lil Curly. To learn more join our Discord server: <${config.discord_link}>`);
	}
};
