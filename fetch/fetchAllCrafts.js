const { axiosFetchJson } = require('../utils/axiosFetchJson');
const { SettingsLoader, settingKeys } = require('../core/SettingsLoader');
async function fetchAllCrafts(cache) {
    const url = 'https://bitjita.com/api/crafts';

    return await cache.readOrFetchData({
        getKey: () => 'allCrafts',
        fetchData: async () => await axiosFetchJson(url),
        parameters: {},
        expireSeconds: SettingsLoader.getSetting(settingKeys.ALL_CRAFTS_EXPIRE_SECONDS, 30)
    });

}
module.exports = {
  fetchAllCrafts
}