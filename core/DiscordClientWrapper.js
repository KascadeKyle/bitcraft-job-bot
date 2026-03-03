require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { discordRegisterCommands } = require('../utils/discordRegisterCommands');
const { sendDiscordMessage } = require('../utils/discordUtils');
const { discordRouteIncomingCommand } = require('../utils/discordRouteIncomingCommand');
const { icons } = require('../utils/iconMap');

//load environment variables
const envDiscordToken = process.env.DISCORD_TOKEN;
const envDiscordClientId = process.env.DISCORD_CLIENT_ID;
const envDebugChannelId = process.env.BOT_REPORT_CHANNEL_ID;
const envAdminUserId = process.env.ADMIN_DISCORD_USER_ID;

class DiscordClientWrapper {
    constructor() {
        this.adminUserId = envAdminUserId;
        this.discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
        this.startTime = new Date();
    }
    async setup() {
        await this.discordClient.login(envDiscordToken);
        await discordRegisterCommands(envDiscordToken, envDiscordClientId);
        await this.listenForCommands();

        //send online message to console/debug channel
        console.log('Bot is running ' + icons.bot);
        await this.sendDebugMessage('Bot is online! ' + icons.bot);
    }
    async sendDebugMessage(message) {
        if (!envDebugChannelId || envDebugChannelId === '' || Number(envDebugChannelId) === 0) {
            console.log('Debug channel not set, skipping debug message');
            return;
        }
        await sendDiscordMessage(envDebugChannelId, message, this.discordClient);
    }
    async listenForCommands() {
        this.discordClient.on('interactionCreate', async interaction => {
            await discordRouteIncomingCommand(interaction, this);
        });
    }
}
module.exports = {
    DiscordClientWrapper
};