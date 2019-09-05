async function form(page, structure, component, tag, node) {
    //per gestire più form uso un for
    let attrNode = null;
    
    let resources = [];
    let attributes = [];
    let temp;
    let type;
    for (let i = 0; i < node.length; i++) {
        //estraggo la resource del form, ad esempio datiUtente
        resources[i] = await page.evaluate((obj) => { return obj.getAttribute('bot-resource'); }, node[i]);

        //prendo i nodi con bot-attr e prendo gli attributes per ogni nodo,
        attrNode = await node[i].$$('[bot-attribute]');

        for (let j = 0; j < attrNode.length; j++) {
            //prendo il valore del bot-attr per questo nodo
            temp = await page.evaluate((obj) => { return obj.getAttribute('bot-attribute'); }, attrNode[j]);
            //se è true non è presente negli attributes già trovati, inserisco
            type = await page.evaluate((obj) => { return obj.getAttribute('type'); }, attrNode[j]);
            attributes.push({ name: temp, selector: '[bot-attribute=' + temp + ']', type: type})
        }

        let containerSelector = await takeSelector(node[i], tag, page);

        structure.push({ component: component,  resource: resources[i], attributes: attributes, selector: {container: containerSelector}});

    }
}

async function takeSelector(node, tag, page) {
    //prendo classe, id e tag dal nodo per usarli per identificarlo
    let clas = await page.evaluate((obj) => { return obj.getAttribute('class'); }, node);
    let id = await page.evaluate((obj) => { return obj.id; }, node);
    let tagName = await page.evaluate((obj) => { return obj.tagName; }, node);

    //inserisco la classe, id, NomeTag per riconoscere meglio il nodo
    let tagToUse = tagName;

    if (id) { tagToUse += "#" + id; }
    if (clas) { tagToUse += "." + clas; }

    return tagToUse;
}

module.exports = { form };