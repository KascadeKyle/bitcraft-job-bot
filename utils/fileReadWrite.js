const fs = require('fs');
const JSONbig = require('json-bigint')({ storeAsString: true });

/** Serializes data with JSONbig and writes to file. Returns true on success. */
function writeToFileJson(filePath, unserializedData) {
    console.log(`Writing to file ${filePath}`);
    try {
        const serializedData = JSONbig.stringify(unserializedData, null, 2);
        fs.writeFileSync(filePath, serializedData);
        return true;
    } catch (error) {
        console.error(`Error writing to file ${filePath}: ${error}`);
        return false;
    }
}

/** Creates file with default value if it does not exist. Returns true if created. */
function createFileIfNotExistsJson(filePath, defaultValue = {}) {
    if (!fs.existsSync(filePath)) {
        console.log(`Creating file that doesn't exist: ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
        return true;
    }
    return false;
}

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

/** Reads and parses JSON (with JSONbig). Returns defaultValue on error or missing file. */
function readFromFileJson(filePath, defaultValue = {}) {
    try {
        console.log(`Reading from file ${filePath}`);
        const serializedData = fs.readFileSync(filePath, 'utf8');
        return JSONbig.parse(serializedData);
    } catch (error) {
        console.error(`Error reading from file ${filePath}: ${error.message}`);
        return defaultValue;
    }
}

module.exports = {
    writeToFileJson,
    createFileIfNotExistsJson,
    fileExists,
    readFromFileJson,
};
