/**
 * Central map of skill_id -> display name for Bitcraft skills.
 */
function getSkills() {
    return {
        1: 'ANY',
        2: 'Forestry',
        3: 'Carpentry',
        4: 'Masonry',
        5: 'Mining',
        6: 'Smithing',
        7: 'Scholar',
        8: 'Leatherworking',
        9: 'Hunting',
        10: 'Tailoring',
        11: 'Farming',
        12: 'Fishing',
        13: 'Cooking',
        14: 'Foraging',
        15: 'Construction',
        17: 'Taming',
        18: 'Slayer',
        19: 'Merchanting',
        21: 'Sailing',
    };
}

function skillIdToSkillName(skillId) {
    const id = Number(skillId);
    const skills = getSkills();
    return skills[id] ?? `skill ${id}`;
}

module.exports = {
    skillIdToSkillName,
    getSkills,
};
