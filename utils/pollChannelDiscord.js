const { fetchChannelCrafts, setChannelCrafts } = require('../fetch/fetchChannelCrafts');
const { SettingsLoader, settingKeys } = require('../core/SettingsLoader');
const { getSkills } = require('./skillMap');
const { editOrInsertDiscordMessage, deleteDiscordMessage, getDiscordChannel } = require('./discordUtils');
const { convertChannelCraftsToEmbedOrganizedBySkill } = require('./embedUtils');
const { convertCraftDataToNewCraftLine } = require('./craftFormatUtils');
const { icons } = require('./iconMap');

function objHasKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function getExistingMessageId(existingData, skillId) {
    return objHasKey(existingData.skills, skillId) ? existingData.skills[skillId].message_id : '';
}

async function getExistingChannelData(channelId, cache) {
    const channelData = await fetchChannelCrafts(cache, channelId);
    return { skills: {}, craft_ids: [], ...channelData };
}

async function deleteSkillMessage(channel, skillId, existingChannelData) {
    const existingMessageId = getExistingMessageId(existingChannelData, skillId);
    if (existingMessageId) {
        await deleteDiscordMessage(channel, existingMessageId);
    }
}

async function sendNewCraftsMessage(channel, newCraftIds, oldCraftIds, channelCrafts) {
    const newCrafts = channelCrafts
        .filter(craft => newCraftIds.has(craft.entity_id) && !oldCraftIds.has(craft.entity_id))
        .slice(0, 12);
    if (newCrafts.length === 0) return '';
    const messageString = newCrafts.map(convertCraftDataToNewCraftLine).join('\n');
    return await editOrInsertDiscordMessage(channel, { content: messageString }, '');
}

/**
 * Removes old "new crafts" messages: embed placeholders not in allowed list,
 * and plain messages older than NEW_CRAFTS_EXPIRE_SECONDS.
 */
async function deleteExpiredNewCraftsMessages(channel, discordWrapper, allowedMessageIds = []) {
    const messages = await channel.messages.fetch({ limit: 25 });
    const expireMs = SettingsLoader.getSetting(settingKeys.NEW_CRAFTS_EXPIRE_SECONDS) * 1000;
    const botUserId = discordWrapper.discordClient.user.id;

    for (const message of messages.values()) {
        if (botUserId !== message.author.id) continue;
        if (message.embeds.length > 0 && !allowedMessageIds.includes(message.id)) {
            await deleteDiscordMessage(channel, message.id);
            console.log(`Deleted message ${message.id} because it was not in allowed: ${allowedMessageIds.join(', ')}`);
        } else if (message.embeds.length === 0 && message.createdTimestamp <= Date.now() - expireMs) {
            await deleteDiscordMessage(channel, message.id);
        }
    }
}

/**
 * Syncs channel state to Discord: updates or creates skill embeds, sends new-crafts
 * summary, prunes expired messages, and persists channel data to cache.
 */
async function sendChannelDataToDiscord(channelId, channelCrafts, cache, discordWrapper) {
    const existingChannelData = await getExistingChannelData(channelId, cache);
    const oldCraftIds = new Set(existingChannelData.craft_ids);
    const newCraftIds = new Set(channelCrafts.map(craft => craft.entity_id));
    const newChannelData = { skills: {}, craft_ids: Array.from(newCraftIds) };

    const embedMessagesOrganizedBySkill = convertChannelCraftsToEmbedOrganizedBySkill(channelCrafts);
    const embedMessageIds = [];
    const channel = await getDiscordChannel(channelId, discordWrapper.discordClient);
    if (!channel) return;

    const allSkills = getSkills();
    for (const skillId in allSkills) {
        if (objHasKey(embedMessagesOrganizedBySkill, skillId)) {
            const embedMessage = embedMessagesOrganizedBySkill[skillId];
            const existingMessageId = getExistingMessageId(existingChannelData, skillId);
            const discordMessageId = await editOrInsertDiscordMessage(
                channel,
                { embeds: [embedMessage.embed] },
                existingMessageId
            );
            newChannelData.skills[skillId] = { craft_ids: embedMessage.craft_ids, message_id: discordMessageId };
            embedMessageIds.push(discordMessageId);
        } else {
            await deleteSkillMessage(channel, skillId, existingChannelData);
        }
    }

    await sendNewCraftsMessage(channel, newCraftIds, oldCraftIds, channelCrafts);
    await deleteExpiredNewCraftsMessages(channel, discordWrapper, embedMessageIds);
    setChannelCrafts(channelId, newChannelData, cache);
    console.log(`Finished channel ${channelId} with ${Object.keys(newChannelData.skills).length} skills and ${newChannelData.craft_ids.length} crafts (old crafts ${oldCraftIds.size}) ${icons.success}`);
}

module.exports = {
    sendChannelDataToDiscord,
};
