async function form(page, structure, component, tag, node) {
    //per gestire più form uso un for
    let resources = [];
    for (let i = 0; i < node.length; i++) {
        //estraggo la resource del form, ad esempio datiUtente
        resources[i] = await page.evaluate((obj) => { return obj.getAttribute('bot-resource'); }, node[i]);

        //prendo i nodi con bot-attr e prendo gli attributes per ogni nodo,
        attrNode = await node[i].$$('[bot-attribute]');

        for (let j = 0; j < attrNode.length; j++) {
            //prendo il valore del bot-attr per questo nodo
            temp = await page.evaluate((obj) => { return obj.getAttribute('bot-attribute'); }, attrNode[j]);
            //se è true non è presente negli attributes già trovati, inserisco
            attributes.push({ name: temp, selector: '[bot-attribute=' + temp + ']' })
        }

    }
    
    structure.push({ component: component });
}

module.exports = { form };