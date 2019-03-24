async function compFunc(page, structure, component, tag) {
    let node = await page.$$(tag);
    let attrNode = null;

    let resources = [];
    let attributes = [];

    let temp = null;
    for (let i = 0; i < node.length; i++) {
        //prendo le resource per ogni nodo
        resources[i] = await page.evaluate((obj) => { return obj.getAttribute('bot-resource'); }, node[i]);

        //prendo i nodi con bot-attr e prendo gli attributes per ogni nodo, controllo che un determinato attributes non sia già stato letto
        attrNode = await node[i].$$('[bot-attribute]');
        let cont = 0;
        attributes = [];
        for (let j = 0; j < attrNode.length; j++) {
            //prendo il valore del bot-attr per questo nodo
            temp = await page.evaluate((obj) => { return obj.getAttribute('bot-attribute'); }, attrNode[j]);
            cont = 0;
            for (let k = 0; k < attributes.length; k++) {
                if (temp != attributes[k].name) {
                    cont++;
                }
            }
            //se è true non è presente negli attributes già trovati, inserisco
            if (cont == attributes.length) {
                attributes.push({name: temp, selector: '[bot-attribute='+temp+']'})
            }
        }

        structure.push({ component: component, resource: resources[i], attributes: attributes, selector: tag });
    }
}

module.exports = { compFunc };