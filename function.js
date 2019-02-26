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
        attrNode = await node[i].$$('[bot-attr]');
        let cont = 0;
        attributes = [];
        for (let j = 0; j < attrNode.length; j++) {
            //prendo il valore del bot-attr per questo nodo
            temp = await page.evaluate((obj) => { return obj.getAttribute('bot-attr'); }, attrNode[j]);
            cont = 0;
            for (let k = 0; k < attributes.length; k++) {
                if (temp != attributes[k]) {
                    cont++;
                }
            }
            //se è true non è presente negli attributes già trovati, inserisco
            if (cont == attributes.length) {
                attributes[j] = temp;
            }
        }

        structure.push({ intent: component, resource: resources[i], attribute: attributes, tag: tag });
    }
}

module.exports = { compFunc };