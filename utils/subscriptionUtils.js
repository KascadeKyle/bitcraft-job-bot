const { fetchClaimMembers } = require('../fetch/fetchClaimMembers');

/** Legacy: normalizes subscription shape if stored keys differ from current code. */
function convertCraftSubscription(sub) {
    return sub;
}

/**
 * Builds a map channelId -> { [entity_id]: craft } by matching each craft
 * against all subscriptions (filter + optional claim-members fetch).
 */
async function convertFormattedCraftsAndSubscriptionsToChannelData(formattedCrafts, subscriptions, cache) {
    const data = {};

    for (const craft of Object.values(formattedCrafts)) {
        for (const sub of subscriptions) {
            const channelId = sub.discord_channel_id;
            if (doesSubscriptionMatchCraft(sub, craft) && await doesSubscriptionMatchCraftClaimMembers(sub, craft, cache)) {
                if (!data[channelId]) data[channelId] = {};
                data[channelId][craft.entity_id] = craft;
            }
        }
    }
    return data;
}

/** Returns true if craft satisfies subscription filters (claim, region, effort, tier, item/skill regex). */
function doesSubscriptionMatchCraft(sub, craft) {
    const isMatchRegex = (target, regexStr) => new RegExp(`^(${regexStr})$`, 'i').test(target);

    if (sub.claimId && sub.claimId !== craft.claim_entity_id) return false;
    if (sub.regionId && sub.regionId !== craft.region_id) return false;
    if (sub.minEffort && sub.minEffort > craft.craft_progress_total) return false;
    if (sub.minTier && sub.minTier > craft.item_tier) return false;
    if (sub.maxTier && sub.maxTier < craft.item_tier) return false;
    if (sub.itemName && !isMatchRegex(craft.item_name, sub.itemName)) return false;
    if (sub.skillName && !isMatchRegex(craft.skill_name, sub.skillName)) return false;
    return true;
}

/**
 * Checks claim-members-only filter; fetches claim members and sets craft.is_claim_member.
 * Only call after other subscription checks pass to avoid fetching for every craft.
 */
async function doesSubscriptionMatchCraftClaimMembers(sub, craft, cache) {
    const claimMembers = await fetchClaimMembers(cache, craft.claim_entity_id);
    const claimMemberIds = claimMembers.members.map(member => member.playerEntityId);
    craft.is_claim_member = claimMemberIds.includes(craft.player_id);

    if (sub.claimMembersOnly && Number(sub.claimMembersOnly) === 1 && !craft.is_claim_member) return false;
    if (sub.claimMembersOnly && Number(sub.claimMembersOnly) === 2 && craft.is_claim_member) return false;
    return true;
}

module.exports = {
    convertCraftSubscription,
    convertFormattedCraftsAndSubscriptionsToChannelData,
    doesSubscriptionMatchCraft,
};
