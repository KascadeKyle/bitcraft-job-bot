const { discordSubscribeCommand } = require('./discordSubscribeCommand');
const { discordUnsubscribeCommand } = require('./discordSubscribeRemoveCommand');
const { discordStatusCommand } = require('./discordStatusCommand');

/**
 * Routes an incoming Discord slash command to the correct handler.
 */
async function discordRouteIncomingCommand(interaction, discordWrapper) {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'subscribe') {
        await discordSubscribeCommand(interaction, discordWrapper);
    } else if (commandName === 'unsubscribe') {
        await discordUnsubscribeCommand(interaction, discordWrapper);
    } else if (commandName === 'status') {
        await discordStatusCommand(interaction, discordWrapper);
    }
}

module.exports = {
    discordRouteIncomingCommand,
};