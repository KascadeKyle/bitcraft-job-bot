const { SubscriptionsManager } = require('../core/SubscriptionsManager');
const { interactionReply, discordTagUser, discordTagChannel } = require('./discordUtils');

/** Handles /unsubscribe: removes channel subscription and replies. */
async function discordUnsubscribeCommand(interaction, discordWrapper) {
    SubscriptionsManager.removeSubscription(interaction.channel.id);
    await interactionReply(interaction, 'Subscription removed', true);
    await discordWrapper.sendDebugMessage(
        `Subscription removed for ${discordTagUser(interaction.user.id)} ${interaction.user.username} on channel ${discordTagChannel(interaction.channel.id)} ${interaction.channel.name}`
    );
}

module.exports = {
    discordUnsubscribeCommand,
};
