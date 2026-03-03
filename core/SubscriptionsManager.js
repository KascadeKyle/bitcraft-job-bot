const { fileExists, createFileIfNotExistsJson, readFromFileJson, writeToFileJson } = require('../utils/fileReadWrite');

const subscriptionsFile = 'subscriptions.json';
let loadedSubscriptions = [];
class SubscriptionsManager {
    constructor() {
        throw new Error('SubscriptionsManager is a static class and cannot be instantiated');
    }
    static setup() {
        if (!fileExists(subscriptionsFile)) {
            createFileIfNotExistsJson(subscriptionsFile, []);
        }
        loadedSubscriptions = readFromFileJson(subscriptionsFile, []);
    }
    static getSubscriptions() {
        return loadedSubscriptions;
    }
    static addSubscription(subscription) {
        //channels are allowed one subscription - delete any existing subscriptions for this channel
        SubscriptionsManager.removeSubscription(subscription.discord_channel_id);

        //add the new subscription
        loadedSubscriptions.push(subscription);

        //use a file instead of cache - we want to persist the subscriptions and it makes it easier for admins to view them
        writeToFileJson(subscriptionsFile, loadedSubscriptions);

    }
    static removeSubscription(channelId) {
        loadedSubscriptions = loadedSubscriptions.filter(sub => sub.discord_channel_id !== channelId);
        writeToFileJson(subscriptionsFile, loadedSubscriptions);
    }
}
module.exports = {
    SubscriptionsManager
}