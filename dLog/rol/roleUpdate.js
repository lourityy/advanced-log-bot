const { console } = require("sneaks");
const {
  EmbedBuilder,
  PermissionsBitField,
  AuditLogEvent,
  userMention,
  ChannelType,
} = require("discord.js");
const db = require("croxydb");

/**
 * * @param {import("discord.js").Client} client
 * @param {import("discord.js").GuildChannel} oldRole
 * * @param {import("discord.js").GuildChannel} newRole
 */
module.exports = async (client, oldRole, newRole) => {
  let x = db.get(`dLog${newRole.guild.id}`);
  if (!x) return;
  const logChannel = client.channels.cache.get(x);
  if (!logChannel) return db.delete(`dLog${newRole.guild.id}`);

  const fetchedLogs = await newRole.guild.fetchAuditLogs({
    type: AuditLogEvent.RoleUpdate,
    limit: 1,
  });

  const firstEntry = fetchedLogs.entries.first();
  if (!firstEntry) return;

  const { executor } = firstEntry;
  if (executor.bot || client.user.id === executor.id) return;

  const executorMember = newRole.guild.members.cache.get(executor.id);
  if (!executorMember) return;

  const oldPermissions = oldRole.permissions.toArray();
  const newPermissions = newRole.permissions.toArray();

  const addedPermissions = newPermissions.filter(perm => !oldPermissions.includes(perm));
  const removedPermissions = oldPermissions.filter(perm => !newPermissions.includes(perm));


  const roleUpdateEmbed = new EmbedBuilder()
    .setColor("Yellow")
    .setAuthor({
      name: "Rol Güncellendi",
      iconURL: newRole.guild.iconURL(),
    })
    .setDescription(
      `${userMention(executor.id)} (\`${executor.id
      }\`) tarafından bir rol güncellendi!`
    )
    .addFields(
      {
        name: "Rol:",
        value: `${newRole} (${newRole.name})`,
        inline: true,
      },
      {
        name: "Tarih:",
        value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Kullanıcı:",
        value: `${userMention(executor.id)}`,
        inline: true,
      },
      {
        name: "Güncellenen Özellik:",
        value: `${oldRole.name !== newRole.name
          ? `\`\`\`ansi\n[2;34m[2;32m[2;33mRol Adı:[0m[2;32m[0m[2;34m[0m ${oldRole.name} → ${newRole.name}\`\`\`\n`
          : ""
          }${addedPermissions.join(", ") ? `\`\`\`ansi\n[2;34m[2;32m[2;32mAçılan İzin(ler) →[0m[2;32m[0m[2;34m[0m ${addedPermissions
            .join(", ")
            .replaceAll("ViewChannel", "Kanalları Görüntüle")
            .replaceAll("ViewChannel,", "Kanalları Görüntüle")
            .replaceAll("ManageChannels", "Kanalları Yönet")
            .replaceAll("ManageChannels,", "Kanalları Yönet")
            .replaceAll("ManageRoles", "Rolleri Yönet")
            .replaceAll("ManageRoles,", "Rolleri Yönet")
            .replaceAll("ManageGuildExpressions", "İfadeler Oluştur")
            .replaceAll("ManageGuildExpressions,", "İfadeler Oluştur")
            .replaceAll("ManageEmojisAndStickers", "İfadeleri Yönet")
            .replaceAll("ManageEmojisAndStickers,", "İfadeleri Yönet")
            .replaceAll("ViewAuditLog", "Denetim Kaydını Görüntüle")
            .replaceAll("ViewAuditLog,", "Denetim Kaydını Görüntüle")
            .replaceAll("ManageWebhooks", "Webhook'ları Yönet")
            .replaceAll("ManageWebhooks,", "Webhook'ları Yönet")
            .replaceAll("ManageGuild", "Sunucuyu Yönet")
            .replaceAll("ManageGuild,", "Sunucuyu Yönet")
            .replaceAll("CreateInstantInvite", "Davet Oluştur")
            .replaceAll("CreateInstantInvite,", "Davet Oluştur")
            .replaceAll("ChangeNickname", "Takma Ad Değiştir")
            .replaceAll("ChangeNickname,", "Takma Ad Değiştir")
            .replaceAll("ManageNicknames", "Takma Adları Yönet")
            .replaceAll("ManageNicknames,", "Takma Adları Yönet")
            .replaceAll("KickMembers", "Üyeleri At")
            .replaceAll("KickMembers,", "Üyeleri At")
            .replaceAll("BanMembers", "Üyeleri Engelle")
            .replaceAll("BanMembers,", "Üyeleri Engelle")
            .replaceAll("ModerateMembers", "Üyelere Zaman Aşımı Uygula")
            .replaceAll("ModerateMembers,", "Üyelere Zaman Aşımı Uygula")
            .replaceAll("SendMessages", "Mesaj Gönder")
            .replaceAll("SendMessages,", "Mesaj Gönder")
            .replaceAll("Mesaj GönderInThreads", "Alt Başlıklarda Mesajlar Gönder")
            .replaceAll("Mesaj GönderInThreads,", "Alt Başlıklarda Mesajlar Gönder")
            .replaceAll("CreatePublicThreads", "Herkese Açık Alt Başlıklar Oluştur")
            .replaceAll("CreatePublicThreads,", "Herkese Açık Alt Başlıklar Oluştur")
            .replaceAll("CreatePrivateThreads", "Özel Alt Başlıklar Oluştur")
            .replaceAll("CreatePrivateThreads,", "Özel Alt Başlıklar Oluştur")
            .replaceAll("AttachFiles", "Dosya Ekle")
            .replaceAll("AttachFiles,", "Dosya Ekle")
            .replaceAll("EmbedLinks", "Bağlantı Yerleştir")
            .replaceAll("EmbedLinks,", "Bağlantı Yerleştir")
            .replaceAll("AddReactions", "Tepki Ekle")
            .replaceAll("AddReactions,", "Tepki Ekle")
            .replaceAll("UseExternalEmojis", "Harici Emoji Kullan")
            .replaceAll("UseExternalEmojis,", "Harici Emoji Kullan")
            .replaceAll("UseExternalStickers", "Harici Çıkartmalar Kullan")
            .replaceAll("UseExternalStickers,", "Harici Çıkartmalar Kullan")
            .replaceAll("MentionEveryone", "@everyone/@here/Rollerden Bahset")
            .replaceAll("MentionEveryone,", "@everyone/@here/Rollerden Bahset")
            .replaceAll("ManageMessages", "Mesajları Yönet")
            .replaceAll("ManageMessages,", "Mesajları Yönet")
            .replaceAll("ManageThreads", "Alt Başlıkları Yönet")
            .replaceAll("ManageThreads,", "Alt Başlıkları Yönet")
            .replaceAll("ReadMessageHistory", "Mesaj Geçmişini Oku")
            .replaceAll("ReadMessageHistory,", "Mesaj Geçmişini Oku")
            .replaceAll("SendTTSMessages", "Metin Okuma Mesajı Gönder")
            .replaceAll("SendTTSMessages,", "Metin Okuma Mesajı Gönder")
            .replaceAll("UseApplicationCommands", "Uygulama Komutlarını Kullan")
            .replaceAll("UseApplicationCommands,", "Uygulama Komutlarını Kullan")
            .replaceAll("SendVoiceMessages", "Sesli Mesaj Gönder")
            .replaceAll("SendVoiceMessages,", "Sesli Mesaj Gönder")
            .replaceAll("Connect", "Bağlan")
            .replaceAll("Connect,", "Bağlan")
            .replaceAll("Speak", "Konuş")
            .replaceAll("Speak,", "Konuş")
            .replaceAll("Stream", "Video")
            .replaceAll("Stream,", "Video")
            .replaceAll("UseEmbeddedActivities", "Kullanıcı Etkinlikleri")
            .replaceAll("UseEmbeddedActivities,", "Kullanıcı Etkinlikleri")
            .replaceAll("UseSoundboard", "Ses Panelini Kullan")
            .replaceAll("UseSoundboard,", "Ses Panelini Kullan")
            .replaceAll("UseExternalSounds", "Harici Sesler Kullan")
            .replaceAll("UseExternalSounds,", "Harici Sesler Kullan")
            .replaceAll("UseVAD", "Ses Eylemini Kullan")
            .replaceAll("UseVAD,", "Ses Eylemini Kullan")
            .replaceAll("PriorityKonuşer", "Öncelikli Konuşmacı")
            .replaceAll("PriorityKonuşer,", "Öncelikli Konuşmacı")
            .replaceAll("MuteMembers", "Üyeleri Sustur")
            .replaceAll("MuteMembers,", "Üyeleri Sustur")
            .replaceAll("DeafenMembers", "Üyeleri Sağırlaştır")
            .replaceAll("DeafenMembers,", "Üyeleri Sağırlaştır")
            .replaceAll("MoveMembers", "Üyeleri Taşı")
            .replaceAll("MoveMembers,", "Üyeleri Taşı")
            .replaceAll("ManageEvents", "Etkinlikleri Yönet")
            .replaceAll("ManageEvents,", "Etkinlikleri Yönet")
            .replaceAll("Administrator", "Yönetici")
            .replaceAll("Administrator,", "Yönetici")}\`\`\`\n` : " "}${removedPermissions.join(", ") ? `\`\`\`ansi\n[2;34m[2;32m[2;31mKapatılan İzin(ler) →[0m[2;32m[0m[2;34m[0m ${removedPermissions
              .join(", ")
              .replaceAll("ViewChannel", "Kanalları Görüntüle")
              .replaceAll("ViewChannel,", "Kanalları Görüntüle")
              .replaceAll("ManageChannels", "Kanalları Yönet")
              .replaceAll("ManageChannels,", "Kanalları Yönet")
              .replaceAll("ManageRoles", "Rolleri Yönet")
              .replaceAll("ManageRoles,", "Rolleri Yönet")
              .replaceAll("ManageGuildExpressions", "İfadeler Oluştur")
              .replaceAll("ManageGuildExpressions,", "İfadeler Oluştur")
              .replaceAll("ManageEmojisAndStickers", "İfadeleri Yönet")
              .replaceAll("ManageEmojisAndStickers,", "İfadeleri Yönet")
              .replaceAll("ViewAuditLog", "Denetim Kaydını Görüntüle")
              .replaceAll("ViewAuditLog,", "Denetim Kaydını Görüntüle")
              .replaceAll("ManageWebhooks", "Webhook'ları Yönet")
              .replaceAll("ManageWebhooks,", "Webhook'ları Yönet")
              .replaceAll("ManageGuild", "Sunucuyu Yönet")
              .replaceAll("ManageGuild,", "Sunucuyu Yönet")
              .replaceAll("CreateInstantInvite", "Davet Oluştur")
              .replaceAll("CreateInstantInvite,", "Davet Oluştur")
              .replaceAll("ChangeNickname", "Takma Ad Değiştir")
              .replaceAll("ChangeNickname,", "Takma Ad Değiştir")
              .replaceAll("ManageNicknames", "Takma Adları Yönet")
              .replaceAll("ManageNicknames,", "Takma Adları Yönet")
              .replaceAll("KickMembers", "Üyeleri At")
              .replaceAll("KickMembers,", "Üyeleri At")
              .replaceAll("BanMembers", "Üyeleri Engelle")
              .replaceAll("BanMembers,", "Üyeleri Engelle")
              .replaceAll("ModerateMembers", "Üyelere Zaman Aşımı Uygula")
              .replaceAll("ModerateMembers,", "Üyelere Zaman Aşımı Uygula")
              .replaceAll("SendMessages", "Mesaj Gönder")
              .replaceAll("SendMessages,", "Mesaj Gönder")
              .replaceAll("Mesaj GönderInThreads", "Alt Başlıklarda Mesajlar Gönder")
              .replaceAll("Mesaj GönderInThreads,", "Alt Başlıklarda Mesajlar Gönder")
              .replaceAll("CreatePublicThreads", "Herkese Açık Alt Başlıklar Oluştur")
              .replaceAll("CreatePublicThreads,", "Herkese Açık Alt Başlıklar Oluştur")
              .replaceAll("CreatePrivateThreads", "Özel Alt Başlıklar Oluştur")
              .replaceAll("CreatePrivateThreads,", "Özel Alt Başlıklar Oluştur")
              .replaceAll("AttachFiles", "Dosya Ekle")
              .replaceAll("AttachFiles,", "Dosya Ekle")
              .replaceAll("EmbedLinks", "Bağlantı Yerleştir")
              .replaceAll("EmbedLinks,", "Bağlantı Yerleştir")
              .replaceAll("AddReactions", "Tepki Ekle")
              .replaceAll("AddReactions,", "Tepki Ekle")
              .replaceAll("UseExternalEmojis", "Harici Emoji Kullan")
              .replaceAll("UseExternalEmojis,", "Harici Emoji Kullan")
              .replaceAll("UseExternalStickers", "Harici Çıkartmalar Kullan")
              .replaceAll("UseExternalStickers,", "Harici Çıkartmalar Kullan")
              .replaceAll("MentionEveryone", "@everyone/@here/Rollerden Bahset")
              .replaceAll("MentionEveryone,", "@everyone/@here/Rollerden Bahset")
              .replaceAll("ManageMessages", "Mesajları Yönet")
              .replaceAll("ManageMessages,", "Mesajları Yönet")
              .replaceAll("ManageThreads", "Alt Başlıkları Yönet")
              .replaceAll("ManageThreads,", "Alt Başlıkları Yönet")
              .replaceAll("ReadMessageHistory", "Mesaj Geçmişini Oku")
              .replaceAll("ReadMessageHistory,", "Mesaj Geçmişini Oku")
              .replaceAll("SendTTSMessages", "Metin Okuma Mesajı Gönder")
              .replaceAll("SendTTSMessages,", "Metin Okuma Mesajı Gönder")
              .replaceAll("UseApplicationCommands", "Uygulama Komutlarını Kullan")
              .replaceAll("UseApplicationCommands,", "Uygulama Komutlarını Kullan")
              .replaceAll("SendVoiceMessages", "Sesli Mesaj Gönder")
              .replaceAll("SendVoiceMessages,", "Sesli Mesaj Gönder")
              .replaceAll("Connect", "Bağlan")
              .replaceAll("Connect,", "Bağlan")
              .replaceAll("Speak", "Konuş")
              .replaceAll("Speak,", "Konuş")
              .replaceAll("Stream", "Video")
              .replaceAll("Stream,", "Video")
              .replaceAll("UseEmbeddedActivities", "Kullanıcı Etkinlikleri")
              .replaceAll("UseEmbeddedActivities,", "Kullanıcı Etkinlikleri")
              .replaceAll("UseSoundboard", "Ses Panelini Kullan")
              .replaceAll("UseSoundboard,", "Ses Panelini Kullan")
              .replaceAll("UseExternalSounds", "Harici Sesler Kullan")
              .replaceAll("UseExternalSounds,", "Harici Sesler Kullan")
              .replaceAll("UseVAD", "Ses Eylemini Kullan")
              .replaceAll("UseVAD,", "Ses Eylemini Kullan")
              .replaceAll("PriorityKonuşer", "Öncelikli Konuşmacı")
              .replaceAll("PriorityKonuşer,", "Öncelikli Konuşmacı")
              .replaceAll("MuteMembers", "Üyeleri Sustur")
              .replaceAll("MuteMembers,", "Üyeleri Sustur")
              .replaceAll("DeafenMembers", "Üyeleri Sağırlaştır")
              .replaceAll("DeafenMembers,", "Üyeleri Sağırlaştır")
              .replaceAll("MoveMembers", "Üyeleri Taşı")
              .replaceAll("MoveMembers,", "Üyeleri Taşı")
              .replaceAll("ManageEvents", "Etkinlikleri Yönet")
              .replaceAll("ManageEvents,", "Etkinlikleri Yönet")
              .replaceAll("Administrator", "Yönetici")
              .replaceAll("Administrator,", "Yönetici")}\`\`\`\n`
              : " "
          }`,
      }
    )
    .setThumbnail(executor.displayAvatarURL());

  logChannel.send({ embeds: [roleUpdateEmbed] });
  return;
};
