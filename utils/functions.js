function getDifference(setA, setB) {
    return new Set(
        [...setA].filter(element => !setB.has(element))
    );
}

async function sleep(ms) {
    return new Promise(async(resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = { getDifference, sleep }