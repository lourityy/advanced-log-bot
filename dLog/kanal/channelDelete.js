const {
  EmbedBuilder,
  PermissionsBitField,
  AuditLogEvent,
  userMention,
} = require("discord.js");
const db = require("croxydb");
module.exports = async (client, channel) => {
  let x = db.get(`dLog${channel.guild.id}`);
  if (!x) return;
  const logChannel = client.channels.cache.get(x);
  if (!logChannel) return db.delete(`dLog${channel.guild.id}`);

  const fetchedLogs = await channel.guild.fetchAuditLogs({
    type: AuditLogEvent.ChannelDelete,
    limit: 1,
  });

  const firstEntry = fetchedLogs.entries.first();
  if (!firstEntry) return;

  const { executor } = firstEntry;
  if (executor.bot || client.user.id === executor.id) return;

  const executorMember = channel.guild.members.cache.get(executor.id);
  if (!executorMember) return;

  const channelDeleteEmbed = new EmbedBuilder()
    .setColor("Red")
    .setAuthor({ name: "Kanal Silindi", iconURL: channel.guild.iconURL() })
    .setDescription(
      `${userMention(executor.id)} (\`${
        executor.id
      }\`) tarafından bir kanal silindi!`
    )
    .addFields(
      { name: "Kanal:", value: `${channel.name}`, inline: true },
      {
        name: "Tarih:",
        value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Kullanıcı:",
        value: `${userMention(executor.id)}`,
        inline: true,
      }
    )
    .setThumbnail(executor.displayAvatarURL());

  logChannel.send({ embeds: [channelDeleteEmbed] });
  return;
};
