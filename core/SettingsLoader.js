const { createFileIfNotExistsJson, fileExists, readFromFileJson, writeToFileJson } = require('../utils/fileReadWrite');
const settingKeys = Object.freeze({
    CACHE_FILE_PATH: 'CACHE_FILE_PATH',
    WRITE_CACHE_FILE: 'WRITE_CACHE_FILE',
    ALL_CRAFTS_EXPIRE_SECONDS: 'ALL_CRAFTS_EXPIRE_SECONDS',
    CLAIM_MEMBERS_EXPIRE_SECONDS: 'CLAIM_MEMBERS_EXPIRE_SECONDS',
    NEW_CRAFTS_EXPIRE_SECONDS: 'NEW_CRAFTS_EXPIRE_SECONDS',
    POLL_CRAFTS_INTERVAL_SECONDS: 'POLL_CRAFTS_INTERVAL_SECONDS',
});

const defaultSettings = Object.freeze({
    CACHE_FILE_PATH: "cache.json",
    WRITE_CACHE_FILE: false,
    ALL_CRAFTS_EXPIRE_SECONDS: 30, // 30 seconds
    CLAIM_MEMBERS_EXPIRE_SECONDS: 60 * 60, // 1 hour
    NEW_CRAFTS_EXPIRE_SECONDS: 60 * 2, // 2 minutes
    POLL_CRAFTS_INTERVAL_SECONDS: 30, // poll crafts every 30 seconds
});

let loadedSettings = {};

class SettingsLoader {
    constructor() {
        throw new Error('SettingsLoader is a static class and cannot be instantiated');
    }
    static setup() {
        loadedSettings = { ...defaultSettings };
        const settingsFile = 'settings.json';
        if (!fileExists(settingsFile)) {
            createFileIfNotExistsJson(settingsFile);
            writeToFileJson(settingsFile, loadedSettings);
        }
        else {
            loadedSettings = {...defaultSettings, ...readFromFileJson(settingsFile, defaultSettings)};
            writeToFileJson(settingsFile, loadedSettings); //overwrite the file with the new settings
        }
    }
    static getSetting(key, defaultValue = null) {
        if (loadedSettings[key] === undefined) {
            console.log(`Setting ${key} not found, using default value: ${defaultValue}`);
            return defaultValue;
        }
        return loadedSettings[key];
    }
}

module.exports = {
    SettingsLoader,
    settingKeys,
};