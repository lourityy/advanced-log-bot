const {
  EmbedBuilder,
  PermissionsBitField,
  AuditLogEvent,
  userMention,
} = require("discord.js");
const db = require("croxydb");
module.exports = async (client, role) => {
  let x = db.get(`dLog${role.guild.id}`);
  if (!x) return;
  const logChannel = client.channels.cache.get(x);
  if (!logChannel) return db.delete(`dLog${role.guild.id}`);

  const fetchedLogs = await role.guild.fetchAuditLogs({
    type: AuditLogEvent.RoleDelete,
    limit: 1,
  });

  const firstEntry = fetchedLogs.entries.first();
  if (!firstEntry) return;

  const { executor } = firstEntry;
  if (executor.bot || client.user.id === executor.id) return;

  const executorMember = role.guild.members.cache.get(executor.id);
  if (!executorMember) return;

  const roleDeleteEmbed = new EmbedBuilder()
    .setColor("Red")
    .setAuthor({ name: "Rol Silindi", iconURL: role.guild.iconURL() })
    .setDescription(
      `${userMention(executor.id)} (\`${
        executor.id
      }\`) tarafından bir rol silindi!`
    )
    .addFields(
      { name: "Rol:", value: `${role.name}`, inline: true },
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

  logChannel.send({ embeds: [roleDeleteEmbed] });
  return;
};
