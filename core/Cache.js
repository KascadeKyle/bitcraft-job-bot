const { SettingsLoader, settingKeys } = require('./SettingsLoader');
const { createFileIfNotExistsJson, readFromFileJson, writeToFileJson } = require('../utils/fileReadWrite');
class Cache {
    constructor() {
        this.entries = {};
    }
    setup() {
        this.entries = {};

        //Typically cache will just be in memory, but if the settings are set to use a file, then we will read from the file
        const { settingsUseCacheFile, settingsCacheFilePath } = this.getCacheSettings();
        if (settingsUseCacheFile) {
            createFileIfNotExistsJson(settingsCacheFilePath, {});
            this.entries = readFromFileJson(settingsCacheFilePath);
        }
        else {
            this.entries = {};
        }
    }

    saveToFile() {
        const { settingsUseCacheFile, settingsCacheFilePath } = this.getCacheSettings();
        if (settingsUseCacheFile) {
            writeToFileJson(settingsCacheFilePath, this.entries);
        }
    }
    getCacheSettings() {
        return {
            settingsUseCacheFile: SettingsLoader.getSetting(settingKeys.WRITE_CACHE_FILE, false),
            settingsCacheFilePath: SettingsLoader.getSetting(settingKeys.CACHE_FILE_PATH, "cache.json")
        };
    }

    async readOrFetchData(options) {
        const { getKey, fetchData, expireSeconds } = options;
        const key = getKey();
        if (this.entries[key]) {
            const { data, timestamp } = this.entries[key];
            if (timestamp + expireSeconds * 1000 > Date.now() || expireSeconds === -1) {
                //Data found and not expired, return it
                return data;
            }
        }

        //Data not found or expired, fetch it
        const data = await fetchData();
        this.setData(key, data);
        return data;
    }

    setData(key, data) {
        this.entries[key] = { data, timestamp: Date.now() };
        this.saveToFile();
    }

}
module.exports = {
    Cache
}