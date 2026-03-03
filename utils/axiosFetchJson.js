const axios = require('axios');
const JSONbig = require('json-bigint')({ storeAsString: true });

/** Fetches URL as JSON using axios; parses with JSONbig. Returns {} on error. */
async function axiosFetchJson(url) {
    try {
        console.log(`Fetching JSON from ${url}`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json,text/plain,*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://bitjita.com/',
                'Connection': 'keep-alive',
            },
            transformResponse: [(data) => JSONbig.parse(data)],
        });
        console.log(`Fetched JSON from ${url} successfully`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching JSON from ${url}: ${error}`);
        return {};
    }
}

module.exports = {
    axiosFetchJson,
};
