const LIST = require("./components/list.js");

async function compFunc(page, structure, component, tag) {
    let node = await page.$$(tag);
    if(component == "list") {
        await LIST.list(page, structure, component, tag, node);
    } else if (component == "form") {
        console.log("")
    }
    console.log(structure);
}

module.exports = { compFunc };