const { userMention, PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs")

const client = new Client({
    intents: Object.values(Discord.IntentsBitField.Flags),
    partials: Object.values(Partials),
});

const PARTIALS = Object.values(Partials);
const db = require("croxydb");
const config = require("./config.json");
const chalk = require("chalk");

global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs");
const interactionCreate = require("./events/interactionCreate");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });
    console.log(chalk.red`[COMMAND]` + ` ${props.name} komutu yüklendi.`)
});

readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(chalk.blue`[EVENT]` + ` ${name} eventi yüklendi.`)
});

readdirSync('./dLog').forEach(category => {
    readdirSync(`./dLog/${category}`).forEach(async file => {
        const eve = require(`./dLog/${category}/${file}`);
        const name = file.split(".")[0];
    
        client.on(name, (...args) => {
            eve(client, ...args)
        });
        console.log(chalk.blue`[EVENT]` + ` ${name} dLog yüklendi.`)
    })
})
client.login(config.bot.token)
/*
process.on("unhandledRejection", (reason, p) => {
    console.log(chalk.blue(`${reason} ${p}`));
})

process.on("unhandledRejection", async (error) => {
    return console.log(chalk.red(`Bir hata oluştu!\n\n${error}`));
});
// lourity & slenzy tarafından yapılmıştır. Discord.gg/Altyapilar <3