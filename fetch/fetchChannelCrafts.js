// This is not actually fetched from bitjita, just stored in cache after processing
// Will keep the file to keep the same pattern for fetching data from cache

async function fetchChannelCrafts(cache, channelId) {
    return await cache.readOrFetchData({
        getKey: () => `channelCrafts_${channelId}`,
        fetchData: async () => [],
        expireSeconds: -1 // Never expire
    });

}
function setChannelCrafts(channelId, channelCrafts, cache){
    cache.setData(`channelCrafts_${channelId}`, channelCrafts);
}
module.exports = {
    fetchChannelCrafts,
    setChannelCrafts
};