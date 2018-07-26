const Discord = require('discord.js');
const green = '#008000';
const red = '#FF0000';
const yellow = '#FFD700';

exports.run = function(client, message, args) {
  var embed = new Discord.RichEmbed();
  embed.setTitle('About Kosh')
  embed.setDescription('Kosh Systems is a moderation and fun Discord bot. Run ;invite for an invite.');
  embed.setColor('008000');
  embed.addField('Uptime in mili-seconds', `${client.uptime}`);
  embed.addField('Created by RedstoneClaw101 & Lil Curly');
  embed.addField('Users', `${client.users.size}`)
  embed.addField('Channels', `${client.channels.size}`)
  embed.addField('Shard(s)', '[object Object]')
  embed.addField('Commands', '29')
  embed.addField('Kosh Systems™ 2018-22. All right reserved.')
  embed.setFooter('Kosh Systems')
  embed.setTimestamp()

  message.channel.sendEmbed(embed);
};

exports.conf = {
enabled: true,
guildOnly: false,
aliases: [],
permLevel: 0
};

exports.help = {
name: 'about',
description: 'Get all the additional info which arent viewed in other commands.',
usage: 'GET INFO'
};
