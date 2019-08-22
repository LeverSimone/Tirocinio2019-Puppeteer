const LIST = require("./components/list.js");
const FORM = require("./components/form.js");

async function compFunc(page, structure, component, tag) {
    let node = await page.$$(tag);
    if(component == "list") {
        await LIST.list(page, structure, component, tag, node);
    } else if (component == "form") {
        await FORM.form(page, structure, component, tag, node);
    }
}

module.exports = { compFunc };