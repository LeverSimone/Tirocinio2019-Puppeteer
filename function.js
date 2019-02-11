async function listFunc(page, structure, component, tag) {
    let node = await page.$$(tag);

    let resources = [];
    for (let i = 0; i < node.length; i++) {
        resources[i] = await page.evaluate((obj) => { return obj.getAttribute('bot-resource'); }, node[i]);
        structure.push({ intent: component, resource: resources[i], tag: tag });
    }
}

module.exports = {listFunc};