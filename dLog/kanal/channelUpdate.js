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
 * @param {import("discord.js").GuildChannel} oldChannel
 * * @param {import("discord.js").GuildChannel} newChannel
 */
module.exports = async (client, oldChannel, newChannel) => {
  let x = db.get(`dLog${newChannel.guild.id}`);
  if (!x) return;
  const logChannel = client.channels.cache.get(x);
  if (!logChannel) return db.delete(`dLog${newChannel.guild.id}`);

  const fetchedLogs = await newChannel.guild.fetchAuditLogs({
    type: AuditLogEvent.ChannelUpdate,
    limit: 1,
  });

  const firstEntry = fetchedLogs.entries.first();
  if (!firstEntry) return;

  const { executor } = firstEntry;
  if (executor.bot || client.user.id === executor.id) return;

  const executorMember = newChannel.guild.members.cache.get(executor.id);
  if (!executorMember) return;

  const oldChannelPermissionOverwrites = oldChannel.permissionOverwrites.cache;
  const newChannelPermissionOverwrites = newChannel.permissionOverwrites.cache;

  newChannelPermissionOverwrites.forEach((newOverwrite) => {
    const matchingOldOverwrite = oldChannelPermissionOverwrites.find(
      (oldOverwrite) => oldOverwrite.id === newOverwrite.id
    );

    if (matchingOldOverwrite) {
      const oldAllow = matchingOldOverwrite.allow.toArray();
      const oldDeny = matchingOldOverwrite.deny.toArray();
      const newAllow = newOverwrite.allow.toArray();
      const newDeny = newOverwrite.deny.toArray();

      const changedAllow = oldAllow.filter((perm) => !newAllow.includes(perm));
      const changedDeny = oldDeny.filter((perm) => !newDeny.includes(perm));

      const channelUpdateEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setAuthor({
          name: "Kanal Güncellendi",
          iconURL: newChannel.guild.iconURL(),
        })
        .setDescription(
          `${userMention(executor.id)} (\`${
            executor.id
          }\`) tarafından bir kanal güncellendi!`
        )
        .addFields(
          {
            name: "Kanal:",
            value: `${newChannel} (${newChannel.name})`,
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
            value: `${
              oldChannel.name !== newChannel.name
                ? `\`\`\`ansi\n[2;34m[2;32m[2;33mKanal Adı:[0m[2;32m[0m[2;34m[0m ${oldChannel.name} → ${newChannel.name}\`\`\`\n`
                : ""
            }${
              changedDeny.join(", ")
                ? `\`\`\`ansi\n[2;34m[2;32m[2;32mAçılan İzin(ler) →[0m[2;32m[0m[2;34m[0m ${changedDeny
                    .join(", ")
                    .replaceAll("ViewChannel", "Kanalı Görüntüle")
                    .replaceAll("ViewChannel,", "Kanalı Görüntüle")
                    .replaceAll("ManageChannels", "Kanalı Yönet")
                    .replaceAll("ManageChannels,", "Kanalı Yönet")
                    .replaceAll("ManageRoles", "İzinleri Yönet")
                    .replaceAll("ManageRoles,", "İzinleri Yönet")
                    .replaceAll("ManageWebhooks", "Webhook'ları Yönet")
                    .replaceAll("ManageWebhooks,", "Webhook'ları Yönet")
                    .replaceAll("CreateInstantInvite", "Davet Oluştur")
                    .replaceAll("CreateInstantInvite,", "Davet Oluştur")
                    .replaceAll("SendMessages", "Mesaj Gönder")
                    .replaceAll("SendMessages,", "Mesaj Gönder")
                    .replaceAll(
                      "SendMessagesInThreads",
                      "Alt Başlıklarda Mesajlar Gönder"
                    )
                    .replaceAll(
                      "SendMessagesInThreads,",
                      "Alt Başlıklarda Mesajlar Gönder"
                    )
                    .replaceAll(
                      "CreatePublicThreads",
                      "Herkese Açık Alt Başlıklar Oluştur"
                    )
                    .replaceAll(
                      "CreatePublicThreads,",
                      "Herkese Açık Alt Başlıklar Oluştur"
                    )
                    .replaceAll(
                      "CreatePrivateThreads",
                      "Özel Alt Başlıklar Oluştur"
                    )
                    .replaceAll(
                      "CreatePrivateThreads,",
                      "Özel Alt Başlıklar Oluştur"
                    )
                    .replaceAll("EmbedLinks", "Bağlantı Yerleştir")
                    .replaceAll("EmbedLinks,", "Bağlantı Yerleştir")
                    .replaceAll("AttachFiles", "Dosya Ekle")
                    .replaceAll("AttachFiles,", "Dosya Ekle")
                    .replaceAll("AddReactions", "Tepki Ekle")
                    .replaceAll("AddReactions,", "Tepki Ekle")
                    .replaceAll("UseExternalEmojis", "Harici Emoji Kullan")
                    .replaceAll("UseExternalEmojis,", "Harici Emoji Kullan")
                    .replaceAll(
                      "UseExternalStickers",
                      "Harici Çıkartmalar Kullan"
                    )
                    .replaceAll(
                      "UseExternalStickers,",
                      "Harici Çıkartmalar Kullan"
                    )
                    .replaceAll(
                      "MentionEveryone",
                      "@everyone/@here/Rollerden Bahset"
                    )
                    .replaceAll(
                      "MentionEveryone,",
                      "@everyone/@here/Rollerden Bahset"
                    )
                    .replaceAll("ManageMessages", "Mesajları Yönet")
                    .replaceAll("ManageMessages,", "Mesajları Yönet")
                    .replaceAll("ManageThreads", "Alt Başlıkları Yönet")
                    .replaceAll("ManageThreads,", "Alt Başlıkları Yönet")
                    .replaceAll("ReadMessageHistory", "Mesaj Geçmişini Oku")
                    .replaceAll("ReadMessageHistory,", "Mesaj Geçmişini Oku")
                    .replaceAll("SendTTSMessages", "Metin Okuma Mesajı Gönder")
                    .replaceAll("SendTTSMessages,", "Metin Okuma Mesajı Gönder")
                    .replaceAll(
                      "UseApplicationCommands",
                      "Uygulama Komutlarını Kullan"
                    )
                    .replaceAll(
                      "UseApplicationCommands,",
                      "Uygulama Komutlarını Kullan"
                    )
                    .replaceAll("SendVoiceMessages", "Sesli Mesaj Gönder")
                    .replaceAll("SendVoiceMessages,", "Sesli Mesaj Gönder")
                    .replaceAll(
                      "UseEmbeddedActivities",
                      "Kullanıcı Etkinlikleri"
                    )
                    .replaceAll(
                      "UseEmbeddedActivities,",
                      "Kullanıcı Etkinlikleri"
                    )}\`\`\`\n`
                : " "
            }${
              changedAllow.join(", ")
                ? `\`\`\`ansi\n[2;34m[2;32m[2;31mKapatılan İzin(ler) →[0m[2;32m[0m[2;34m[0m ${changedAllow
                    .join(", ")
                    .replaceAll("ViewChannel", "Kanalı Görüntüle")
                    .replaceAll("ViewChannel,", "Kanalı Görüntüle")
                    .replaceAll("ManageChannels", "Kanalı Yönet")
                    .replaceAll("ManageChannels,", "Kanalı Yönet")
                    .replaceAll("ManageRoles", "İzinleri Yönet")
                    .replaceAll("ManageRoles,", "İzinleri Yönet")
                    .replaceAll("ManageWebhooks", "Webhook'ları Yönet")
                    .replaceAll("ManageWebhooks,", "Webhook'ları Yönet")
                    .replaceAll("CreateInstantInvite", "Davet Oluştur")
                    .replaceAll("CreateInstantInvite,", "Davet Oluştur")
                    .replaceAll("SendMessages", "Mesaj Gönder")
                    .replaceAll("SendMessages,", "Mesaj Gönder")
                    .replaceAll(
                      "SendMessagesInThreads",
                      "Alt Başlıklarda Mesajlar Gönder"
                    )
                    .replaceAll(
                      "SendMessagesInThreads,",
                      "Alt Başlıklarda Mesajlar Gönder"
                    )
                    .replaceAll(
                      "CreatePublicThreads",
                      "Herkese Açık Alt Başlıklar Oluştur"
                    )
                    .replaceAll(
                      "CreatePublicThreads,",
                      "Herkese Açık Alt Başlıklar Oluştur"
                    )
                    .replaceAll(
                      "CreatePrivateThreads",
                      "Özel Alt Başlıklar Oluştur"
                    )
                    .replaceAll(
                      "CreatePrivateThreads,",
                      "Özel Alt Başlıklar Oluştur"
                    )
                    .replaceAll("EmbedLinks", "Bağlantı Yerleştir")
                    .replaceAll("EmbedLinks,", "Bağlantı Yerleştir")
                    .replaceAll("AttachFiles", "Dosya Ekle")
                    .replaceAll("AttachFiles,", "Dosya Ekle")
                    .replaceAll("AddReactions", "Tepki Ekle")
                    .replaceAll("AddReactions,", "Tepki Ekle")
                    .replaceAll("UseExternalEmojis", "Harici Emoji Kullan")
                    .replaceAll("UseExternalEmojis,", "Harici Emoji Kullan")
                    .replaceAll(
                      "UseExternalStickers",
                      "Harici Çıkartmalar Kullan"
                    )
                    .replaceAll(
                      "UseExternalStickers,",
                      "Harici Çıkartmalar Kullan"
                    )
                    .replaceAll(
                      "MentionEveryone",
                      "@everyone/@here/Rollerden Bahset"
                    )
                    .replaceAll(
                      "MentionEveryone,",
                      "@everyone/@here/Rollerden Bahset"
                    )
                    .replaceAll("ManageMessages", "Mesajları Yönet")
                    .replaceAll("ManageMessages,", "Mesajları Yönet")
                    .replaceAll("ManageThreads", "Alt Başlıkları Yönet")
                    .replaceAll("ManageThreads,", "Alt Başlıkları Yönet")
                    .replaceAll("ReadMessageHistory", "Mesaj Geçmişini Oku")
                    .replaceAll("ReadMessageHistory,", "Mesaj Geçmişini Oku")
                    .replaceAll("SendTTSMessages", "Metin Okuma Mesajı Gönder")
                    .replaceAll("SendTTSMessages,", "Metin Okuma Mesajı Gönder")
                    .replaceAll(
                      "UseApplicationCommands",
                      "Uygulama Komutlarını Kullan"
                    )
                    .replaceAll(
                      "UseApplicationCommands,",
                      "Uygulama Komutlarını Kullan"
                    )
                    .replaceAll("SendVoiceMessages", "Sesli Mesaj Gönder")
                    .replaceAll("SendVoiceMessages,", "Sesli Mesaj Gönder")
                    .replaceAll(
                      "UseEmbeddedActivities",
                      "Kullanıcı Etkinlikleri"
                    )
                    .replaceAll(
                      "UseEmbeddedActivities,",
                      "Kullanıcı Etkinlikleri"
                    )}\`\`\`\n`
                : " "
            }`,
          }
        )
        .setThumbnail(executor.displayAvatarURL());

      logChannel.send({ embeds: [channelUpdateEmbed] });
      return;
    }
  });
};
