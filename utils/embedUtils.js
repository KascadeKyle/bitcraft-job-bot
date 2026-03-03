const { EmbedBuilder } = require('discord.js');
const { formatNumber, formatNumberK } = require('./formatNumber');
const { discordProgressBar, discordTimestamp } = require('./discordUtils');
const { icons } = require('./iconMap');

const MAX_CRAFTS_PER_EMBED = 18;
const INLINE_COLUMNS = 3;
const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Builds a single embed for a set of crafts (one skill): sorted by remaining effort,
 * with inline fields and spacers every INLINE_COLUMNS.
 */
function convertMaxCraftsToEmbed(channelCrafts) {
    const crafts = channelCrafts
        .slice(0, MAX_CRAFTS_PER_EMBED)
        .sort((a, b) => b.craft_progress_remaining - a.craft_progress_remaining);

    const title = crafts[0].skill_name;
    const timestamp = discordTimestamp();
    const randomColor = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0');

    const fields = [];
    for (let i = 0; i < crafts.length; i++) {
        const craft = crafts[i];
        fields.push({
            name: craftMainTitle(craft),
            value: craftInlineDescription(craft),
            inline: true,
        });
        if ((i + 1) % INLINE_COLUMNS === 0) {
            fields.push({ name: ZERO_WIDTH_SPACE, value: ZERO_WIDTH_SPACE });
        }
    }
    fields.push({ name: '', value: `${timestamp} • Powered by Bitjita` });

    return new EmbedBuilder()
        .setTitle(title)
        .setColor(`#${randomColor}`)
        .addFields(fields);
}

function craftMainTitle(data) {
    return `Tier ${data.item_tier} - ${formatNumberK(data.craft_progress_remaining)} Effort`;
}

/** Builds the inline description for one craft: user, location, item, progress bar. */
function craftInlineDescription(data) {
    let description = '';
    const userIcon = data.is_claim_member ? icons.claimMember : icons.unclaimed;

    if (data.player_username) {
        description += `${userIcon} ${data.player_username}\n`;
    }
    if (data.claim_name || data.region_id) {
        const location = `${data.claim_name || 'Unknown'} (R${data.region_id || ''})`;
        description += `${icons.location} ${location}\n`;
    }
    if (data.item_name) {
        description += `${icons.item} ${data.craft_count} x ${data.item_name} T${data.item_tier}\n`;
    }
    if (data.craft_progress_total) {
        description += `${icons.progress} ${formatNumber(data.craft_progress)} / ${formatNumber(
            data.craft_progress_total
        )} (${data.craft_progress_percentage}%)\n`;
    }
    description += `**${discordProgressBar(data.craft_progress_percentage)}**\n`;
    return description;
}

/**
 * Groups channel crafts by skill_id and returns one embed + craft_ids per skill.
 */
function convertChannelCraftsToEmbedOrganizedBySkill(channelCrafts) {
    const embedMessages = {};
    const skillIds = [...new Set(channelCrafts.map(craft => craft.skill_id))];

    for (const skillId of skillIds) {
        const skillCrafts = channelCrafts.filter(craft => craft.skill_id === skillId);
        embedMessages[skillId] = {
            embed: convertMaxCraftsToEmbed(skillCrafts),
            craft_ids: skillCrafts.map(c => c.entity_id),
        };
    }
    return embedMessages;
}

module.exports = {
    convertChannelCraftsToEmbedOrganizedBySkill,
};
