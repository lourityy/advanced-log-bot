const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");
// discord.gg/altyapilar
module.exports = {
  name: "denetim-kaydı",
  description: "Denetim kaydını ayarlarsınız.",
  type: 1,
  options: [
    {
      name: "kanal",
      description: "Kanal seçiniz.",
      type: 7,
      required: true,
      channel_types: [0],
    },
  ],
  run: async (client, interaction) => {
    let kanal = interaction.options.getChannel("kanal").id;
    const kontrol = db.get(`dLog${interaction.guild.id}`);
    try {
      if (kontrol) {
        return interaction.reply({
          content: `Bu sunucuda zaten denetim kaydı sistemi ayarlanmış.`,
        });
      } else {
        db.set(`dLog${interaction.guild.id}`, kanal);
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle("Başarılı")
              .setDescription("Başarıyla denetim kaydı sistemini kurdum.\n\nBu proje [@lourity](https://discord.com/users/1123906177923813396) tarafından geliştirilmiştir."),
          ],
        });
      }
    } catch (err) {
      console.error(chalk.red(`${err}`));
    }
  },
};