const { SubscriptionsManager } = require('../core/SubscriptionsManager');
const { interactionReply, discordTagUser, discordTagChannel } = require('./discordUtils');

function getCommandOptions(interaction) {
    const { options } = interaction;
    return {
        itemName: options.getString('item_name') || '',
        skillName: options.getString('skill_name') || '',
        claimId: options.getString('claim_id') || '',
        minEffort: options.getInteger('min_effort') || 0,
        minTier: options.getInteger('min_tier') || 0,
        maxTier: options.getInteger('max_tier') || 0,
        regionId: options.getInteger('region_id') || 0,
        claimMembersOnly: options.getInteger('claim_members_only') || 0,
    };
}

/** Handles /subscribe: saves subscription for channel and replies (with optional debug notification). */
async function discordSubscribeCommand(interaction, discordWrapper) {
    const { user } = interaction;
    const commandOptions = getCommandOptions(interaction);

    const subscription = {
        ...commandOptions,
        discord_user_id: user.id,
        discord_channel_id: interaction.channel.id,
        created_at: new Date().toISOString(),
    };

    SubscriptionsManager.addSubscription(subscription);
    const replyMessage = `Subscription updated:\n\`\`\`\n${JSON.stringify(subscription, null, 2)}\`\`\``;
    await interactionReply(interaction, replyMessage, true);
    await discordWrapper.sendDebugMessage(
        `Subscription updated for ${discordTagUser(user.id)} ${user.username} on channel ${discordTagChannel(interaction.channel.id)} ${interaction.channel.name}:\n\`\`\`\n${JSON.stringify(subscription, null, 2)}\`\`\``
    );
}

module.exports = {
    discordSubscribeCommand,
};
