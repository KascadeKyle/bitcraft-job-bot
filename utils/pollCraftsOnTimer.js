const { fetchAllCrafts } = require('../fetch/fetchAllCrafts');
const { SubscriptionsManager } = require('../core/SubscriptionsManager');
const { convertFormattedCraftsAndSubscriptionsToChannelData } = require('./subscriptionUtils');
const { convertJsonToFormattedCrafts } = require('./craftFormatUtils');
const { sendChannelDataToDiscord } = require('./pollChannelDiscord');

/**
 * Fetches all crafts, matches them to subscriptions, and sends updated embeds
 * to each subscribed channel (or logs when no channels match).
 */
async function pollCraftsOnTimer(cache, discordWrapper) {
    const allCrafts = await fetchAllCrafts(cache);
    const formattedCrafts = convertJsonToFormattedCrafts(allCrafts);
    const channelData = await convertFormattedCraftsAndSubscriptionsToChannelData(
        formattedCrafts,
        SubscriptionsManager.getSubscriptions(),
        cache
    );
    const channelIds = Object.keys(channelData);

    if (channelIds.length === 0) {
        console.log(`Out of ${SubscriptionsManager.getSubscriptions().length} subscriptions, and ${Object.keys(formattedCrafts).length} crafts, no channels matched`);
        return;
    }

    for (const channelId of channelIds) {
        const crafts = Object.values(channelData[channelId]);
        console.log(`Channel ${channelId}: ${crafts.length} matching crafts`);
        await sendChannelDataToDiscord(channelId, crafts, cache, discordWrapper);
    }
}

module.exports = {
    pollCraftsOnTimer,
};
