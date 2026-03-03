const { SlashCommandBuilder, REST, Routes } = require('discord.js');
const { icons } = require('./iconMap');

const commands = [
    new SlashCommandBuilder()
        .setName('subscribe')
        .setDescription('Subscribe to public crafts (or edit existing subscription)')
        .addStringOption(opt => opt.setName('claim_id').setDescription('Claim ID').setRequired(true))
        .addIntegerOption(opt => opt.setName('region_id').setDescription('Region ID (1-9)').setRequired(false))
        .addIntegerOption(opt => opt.setName('min_effort').setDescription('Minimum total effort for craft').setRequired(false))
        .addIntegerOption(opt => opt.setName('min_tier').setDescription('Minimum tier for craft (1-10)').setRequired(false))
        .addIntegerOption(opt => opt.setName('max_tier').setDescription('Maximum tier for craft (1-10)').setRequired(false))
        .addIntegerOption(opt => opt.setName('claim_members_only').setDescription('0=all, 1=members only, 2=non-members only').setRequired(false))
        .addStringOption(opt => opt.setName('item_name').setDescription('Match certain item names (eg plank|stripped wood)').setRequired(false))
        .addStringOption(opt => opt.setName('skill_name').setDescription('Match certain skill names (eg carpentry|forestry)').setRequired(false))
        .toJSON(),
    new SlashCommandBuilder()
        .setName('unsubscribe')
        .setDescription('Unsubscribe channel')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('Show bot status information')
        .toJSON(),
];

/** Registers slash commands with Discord (subscribe, unsubscribe, status). */
async function discordRegisterCommands(token, clientId) {
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log(`Slash commands registered ${icons.success}`);
}

module.exports = {
    discordRegisterCommands,
};
