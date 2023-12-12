const { EmbedBuilder, PermissionsBitField, userMention } = require("discord.js");
const db = require("croxydb");
module.exports = async (client, oldMessage, newMessage) => {
    let x = db.get(`dLog${oldMessage.guild.id}`);
    if(!x) return;
    const asd = client.channels.cache.get(x);
    const bot = newMessage.guild.members.cache.get(client.user.id);
    if(!bot.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    if(newMessage.author.id === client.user.id) return;
    const messageUpdateEmbed = new EmbedBuilder()
    .setColor("Yellow")
    .setAuthor({ name: "Mesaj Güncellendi", iconURL: newMessage.guild.iconURL() })
    .setDescription(
        `<@${newMessage.author.id}> (\`${
          newMessage.author.id
        }\`) tarafından bir mesaj düzenlendi!`
    )
    .addFields(
      { name: "Eski Mesaj:", value: `${oldMessage.content || "veri bulunamadı"}`, inline: true },
      { name: "Yeni Mesaj:", value: `${newMessage.content || "veri bulunamadı"}`, inline: true },
      {
        name: "Tarih:",
        value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Kullanıcı:",
        value: `${userMention(newMessage.author.id)}`,
        inline: true,
      }
    )
    .setThumbnail(newMessage.author.displayAvatarURL());
    asd.send({
        embeds: [messageUpdateEmbed]
    })
}