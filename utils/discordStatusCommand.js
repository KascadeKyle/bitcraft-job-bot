const { interactionReply } = require('./discordUtils');
const { readFromFileJson } = require('./fileReadWrite');

/**
 * Handles the /status slash command: shows bot status and uptime (admin only).
 */
async function discordStatusCommand(interaction, discordWrapper) {
    const { user } = interaction;

    if (user.id !== discordWrapper.adminUserId) {
        await interactionReply(interaction, 'You are not authorized to use this command', true);
        return;
    }

    const existingSubscriptions = readFromFileJson('subscriptions.json', []);

    const now = new Date();
    const uptimeMs = now - discordWrapper.startTime;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const uptimeDays = Math.floor(uptimeHours / 24);

    let uptimeString = '';
    if (uptimeDays > 0) uptimeString += `${uptimeDays}d `;
    if (uptimeHours % 24 > 0) uptimeString += `${uptimeHours % 24}h `;
    if (uptimeMinutes % 60 > 0) uptimeString += `${uptimeMinutes % 60}m `;
    uptimeString += `${uptimeSeconds % 60}s`;

    const status = {
      uptime: uptimeString,
      subscriptions: existingSubscriptions.length,
      startTime: discordWrapper.startTime,
      first10Subscriptions: existingSubscriptions.slice(0, 10),
    }

    const statusMessage = `🤖 **Bot Status**\n\n\`\`\`\n${JSON.stringify(status, null, 2)}\`\`\``;
    await interactionReply(interaction, statusMessage, true);
}

module.exports = {
    discordStatusCommand,
};