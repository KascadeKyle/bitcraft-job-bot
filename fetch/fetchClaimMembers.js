const { axiosFetchJson } = require('../utils/axiosFetchJson');
const { SettingsLoader, settingKeys } = require('../core/SettingsLoader');
async function fetchClaimMembers(cache, claimId) {
    const url = `https://bitjita.com/api/claims/${claimId}/members`;

    return await cache.readOrFetchData({
        getKey: () => `claimMembers_${claimId}`,
        fetchData: async () => await axiosFetchJson(url),
        expireSeconds: SettingsLoader.getSetting(settingKeys.CLAIM_MEMBERS_EXPIRE_SECONDS, 60 * 60)
    });

}
module.exports = {
    fetchClaimMembers
};