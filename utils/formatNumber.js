function formatNumber(num) {
    return Number(num).toLocaleString();
}

function formatNumberK(num) {
    const rounded = Math.round(Number(num) / 1000);
    if (rounded < 1) return '< 1k';
    return `${rounded}k`;
}

module.exports = {
    formatNumber,
    formatNumberK,
};
