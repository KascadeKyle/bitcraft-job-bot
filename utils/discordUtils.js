const { MessageFlags } = require('discord.js');

/** Returns a Discord relative timestamp string, e.g. &lt;t:1234567890:R&gt;. */
function discordTimestamp(unix = 0) {
    if (unix === 0) unix = Date.now();
    return `<t:${Math.floor(unix / 1000)}:R>`;
}

function discordTagChannel(channelId) {
    return `<#${channelId}>`;
}

function discordTagUser(userId) {
    return `<@${userId}>`;
}

/** Edits the message with existingMessageId if it exists, otherwise sends a new message. Returns message id. */
async function editOrInsertDiscordMessage(channel, discordMessageObject, existingMessageId) {
    try {
        const discordMessage = await channel.messages.fetch(existingMessageId);
        await discordMessage.edit(discordMessageObject);
        return existingMessageId;
    } catch {
        const newMessage = await channel.send(discordMessageObject);
        return newMessage.id;
    }
}

async function getDiscordChannel(channelId, discordClient) {
    try {
        const channel = await discordClient.channels.fetch(channelId);
        if (!channel) {
            console.error(`❌ Failed to get channel ${channelId}`);
        }
        return channel;
    } catch (error) {
        console.error(`❌ Failed to get channel ${channelId}: ${error.message}`);
        console.error(error.stack);
    }
}

async function interactionReply(interaction, content, ephemeral = false) {
    try {
        await interaction.reply({
            content,
            ...(ephemeral && { flags: MessageFlags.Ephemeral }),
        });
    } catch (error) {
        console.error(`❌ Failed to reply to interaction: ${error.message}`);
    }
}

async function sendDiscordMessage(channelId, discordMessageObject, discordClient) {
    const channel = await getDiscordChannel(channelId, discordClient);
    if (!channel) return;
    try {
        const newMessage = await channel.send(discordMessageObject);
        return newMessage.id;
    } catch (error) {
        console.error(`❌ Failed to send message: ${error.message}`);
    }
}

async function deleteDiscordMessage(channel, messageId) {
    if (!channel) return;
    try {
        await channel.messages.delete(messageId);
    } catch (error) {
        console.error(`❌ Failed to delete message: ${error.message}`);
    }
}

/** Returns a 10-character progress bar string (filled + empty blocks). */
function discordProgressBar(percentage) {
    const barLength = 10;
    const filledBars = Math.round(barLength * (percentage / 100));
    const emptyBars = barLength - filledBars;
    return '█'.repeat(filledBars) + '░'.repeat(emptyBars);
}

module.exports = {
    discordTimestamp,
    discordTagChannel,
    discordTagUser,
    editOrInsertDiscordMessage,
    getDiscordChannel,
    interactionReply,
    sendDiscordMessage,
    deleteDiscordMessage,
    discordProgressBar,
};
