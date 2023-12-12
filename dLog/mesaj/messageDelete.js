const { EmbedBuilder, PermissionsBitField, AuditLogEvent, userMention } = require("discord.js");
const db = require("croxydb");
module.exports = async (client,message) => {
    let x = db.get(`dLog${message.guild.id}`);
    if(!x) return;
    const logChannel = client.channels.cache.get(x);
    if (!logChannel) return db.delete(`dLog${message.guild.id}`);
    const bot = message.guild.members.cache.get(client.user.id);
    if(message.author.id === client.user.id) return;
    if(!bot.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    var xdxd = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete, 
      });        
      const asd = xdxd.entries.first();
        const messageDeleteEmbed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({ name: "Mesaj Silindi", iconURL: message.guild.iconURL() })
        .setDescription(
            `${userMention(asd.executor.id)} (\`${
                asd.executor.id
            }\`) tarafından bir mesaj silindi!`
        )
        .addFields(
          { name: "Mesaj:", value: `${message.content || "veri bulunamadı"}`, inline: true },
          {
            name: "Tarih:",
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
            inline: true,
          },
          {
            name: "Kullanıcı:",
            value: `${userMention(message.author.id)}`,
            inline: true,
          }
        )
        .setThumbnail(message.author.displayAvatarURL());
    
        await logChannel.send({
            embeds: [messageDeleteEmbed]
        });
}