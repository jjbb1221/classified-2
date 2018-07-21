
const unirest = require("unirest");

module.exports = (bot, db, config, winston, userDocument, serverDocument, channelDocument, memberDocument, msg, suffix, commandData) => {
	if(suffix) {
		unirest.get(`https://8ball.delegator.com/magic/JSON/${encodeURIComponent(suffix)}`).header("Accept", "application/json").end(res => {
			if(res.status==200) {
				msg.channel.createMessage(`\`\`\`${res.body.magic.answer}\`\`\``);
			} else {
				winston.error("Failed to fetch 8ball answer", {svrid: msg.guild.id, chid: msg.channel.id});
				msg.channel.createMessage("There is a crack on the 8ball and it is broken.");
			}
		});
	} else {
		winston.warn(`Parameters not provided for ${commandData.name} command`, {svrid: msg.guild.id, chid: msg.channel.id, usrid: msg.author.id});
		msg.channel.createMessage(`${msg.author.mention} I don't know, you tell me...`);
	}
};
