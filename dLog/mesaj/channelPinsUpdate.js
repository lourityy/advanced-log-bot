const { EmbedBuilder, PermissionsBitField, AuditLogEvent, userMention } = require("discord.js");
const db = require("croxydb");
module.exports = async (client,message) => {
    let x = db.get(`dLog${channel.guild.id}`);
    if(!x) return;
    const asd = client.channels.cache.get(x);
    const bot = channel.guild.members.cache.get(client.user.id);
    if(!bot.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    var xdxd = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessagePin, 
      });        
      const asdasd = xdxd.entries.first();
        const messagePinsEmbed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: "Mesaj Sabitlendi", iconURL: channel.guild.iconURL() })
        .setDescription(
            `${userMention(asdasd.executor.id)} (\`${
                asdasd.executor.id
            }\`) tarafından bir mesaj sabitlendi!`
        )
        .addFields(
          {
            name: "Tarih:",
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
            inline: true,
          },
          {
            name: "Kullanıcı:",
            value: `${userMention(asdasd.executor.id)}`,
            inline: true,
          }
        )
        .setThumbnail(asdasd.executor.displayAvatarURL());
    
        await asd.send({
            embeds: [messagePinsEmbed]
        });
}