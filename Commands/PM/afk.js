
module.exports = (bot, db, config, winston, userDocument, msg, suffix, commandData) => {
	if(suffix) {
		if(suffix==".") {
			userDocument.afk_message = null;
			msg.channel.createMessage("Your back! I removed your AFK message.");
		} else {
			userDocument.afk_message = suffix;
			msg.channel.createMessage(`I'll show that message if you are mentioned. Run \`${commandData.name} .\` to remove it`);
		}
		userDocument.save(err => {
			if(err) {
				winston.error("I was unable to save the data...", {usrid: msg.author.id}, err);
			}
		});
	} else {
		if(userDocument.afk_message) {
			msg.channel.createMessage(`Your have \`${userDocument.afk_message}\` currently set.`);
		} else {
			msg.channel.createMessage("You don't have an AFK message set :thinking:");
		}
	}
};
