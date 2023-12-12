const { EmbedBuilder, PermissionsBitField, AuditLogEvent, userMention } = require("discord.js");
const db = require("croxydb");

module.exports = async (client, invite) => {
    let x = db.get(`dLog${invite.guild.id}`);
    if(!x) return;
    const logChannel = client.channels.cache.get(x);
    if (!logChannel) return db.delete(`dLog${message.guild.id}`);
    const bot = invite.guild.members.cache.get(client.user.id);
    if(!bot.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    var xdxd = await invite.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.InviteCreate, 
      });        
      const asd = xdxd.entries.first();
        const inviteCreateEmbed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: "Davet Oluşturuldu", iconURL: invite.guild.iconURL() })
        .setDescription(
            `${userMention(asd.executor.id)} (\`${
                asd.executor.id
            }\`) tarafından bir davet oluşturuldu!`
        )
        .addFields(
          {
            name: "Tarih:",
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
            inline: true,
          },
          {
            name: "Kullanıcı:",
            value: `${userMention(asd.executor.id)}`,
            inline: true,
          }
        )
        .setThumbnail(asd.executor.displayAvatarURL());
    
        await logChannel.send({
            embeds: [inviteCreateEmbed]
        });
}