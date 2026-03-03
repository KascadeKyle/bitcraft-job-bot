const { skillIdToSkillName } = require('./skillMap');
const { fetchClaimMembers } = require('../fetch/fetchClaimMembers');
const { formatNumberK } = require('./formatNumber');
const { discordTimestamp } = require('./discordUtils');
const { icons } = require('./iconMap');

/**
 * Converts raw API craft results into a normalized map entity_id -> formatted craft.
 * Resolves item/cargo names and skill names; skips crafts without entityId or craftedItem.
 */
function convertJsonToFormattedCrafts(json) {
    const { craftResults: crafts, items, cargos } = json;
    const formatted = {};

    for (const craft of crafts) {
        if (!craft.entityId) continue;

        const craftedItem = Array.isArray(craft.craftedItem) && craft.craftedItem[0];
        const req = Array.isArray(craft.levelRequirements) ? craft.levelRequirements[0] : { level: 0, skill_id: 0 };
        if (!craftedItem) continue;

        const mappedItem = craftedItem.item_type === 'item'
            ? items.find(i => i.id === craftedItem.item_id)
            : cargos.find(c => c.id === craftedItem.item_id);
        if (!mappedItem) continue;

        formatted[craft.entityId] = {
            entity_id: craft.entityId,
            is_claim_member: false,
            item_name: mappedItem.name,
            item_rarity: mappedItem.rarity,
            item_tier: mappedItem.tier,
            item_tag: mappedItem.tag,
            item_icon_asset_name: mappedItem.iconAssetName,
            craft_count: craft.craftCount,
            craft_progress: craft.progress,
            craft_progress_total: craft.totalActionsRequired,
            craft_progress_percentage: Math.round((craft.progress * 100) / craft.totalActionsRequired),
            craft_progress_remaining: craft.totalActionsRequired - craft.progress,
            region_name: craft.regionName,
            region_id: Number(craft.regionId),
            claim_name: craft.claimName,
            claim_entity_id: craft.claimEntityId,
            craft_completed: craft.completed,
            craft_is_public: craft.isPublic,
            skill_id: req.skill_id,
            level: req.level,
            player_username: craft.ownerUsername,
            player_id: craft.ownerEntityId,
            skill_name: skillIdToSkillName(req.skill_id),
        };
    }
    return formatted;
}

function convertCraftDataToNewCraftLine(craft) {
    return `- ${craft.skill_name} T${craft.item_tier} ${formatNumberK(craft.craft_progress_remaining)} Effort (${craft.item_name}) (${craft.player_username} ${craft.is_claim_member ? icons.claimMember : icons.unclaimed} @ ${craft.claim_name} R${craft.region_id}) ${discordTimestamp()}`;
}

/** Fetches claim members for each craft and sets craft.is_claim_member. */
async function addClaimMembersToCrafts(crafts, cache) {
    for (const craft of crafts) {
        const claimMembers = await fetchClaimMembers(cache, craft.claim_entity_id);
        const claimMemberIds = claimMembers.members.map(member => member.playerEntityId);
        craft.is_claim_member = claimMemberIds.includes(craft.player_id);
    }
    return crafts;
}

module.exports = {
    convertJsonToFormattedCrafts,
    convertCraftDataToNewCraftLine,
    addClaimMembersToCrafts,
};
