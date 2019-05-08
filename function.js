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
                attributes.push({ name: temp, selector: '[bot-attribute=' + temp + ']' })
            }
        }

        let containerSelector = await takeSelector(node[i], tag, page);

        //inserisco item in selector
        let itemSelector = [];
        if (tag == 'ul' || tag == 'ol') {
            itemSelector.push('LI')
        } else {
            let itemNodes = await node[i].$$('[role="listitem"]');

            //ciclo sui nodi per prendere i vari tipi di tag contenenti item che ci possono essere
            for (let i = 0; i < itemNodes.length; i++) {
                let itemSelectorTemp = await takeSelector(itemNodes[i], null, page);
                //controllo che non sia già presente
                let contItem = 0;
                for (let j = 0; j < itemSelector.length; j++) {
                    if (itemSelectorTemp != itemSelector[j]) {
                        contItem++;
                    }
                }
                //se è true non è presente nei selector degli item già trovati, inserisco
                if (contItem == itemSelector.length) {
                    itemSelector.push(itemSelectorTemp);
                }
            }

        }

        structure.push({ component: component, resource: resources[i], attributes: attributes, selector: { container: containerSelector, item: itemSelector } });
    }
}

async function takeSelector(node, tag, page) {
    //prendo classe, id e tag dal nodo per usarli per identificarlo
    let clas = await page.evaluate((obj) => { return obj.getAttribute('class'); }, node);
    let id = await page.evaluate((obj) => { return obj.id; }, node);
    let tagName = await page.evaluate((obj) => { return obj.tagName; }, node);

    //inserisco la classe, id, NomeTag per riconoscere meglio il nodo
    let tagToUse = tagName;

    if (tag == '[role=\'list\']') { tagToUse += tag; }
    if (id) { tagToUse += "#" + id; }
    if (clas) { tagToUse += "." + clas; }

    return tagToUse;
}

module.exports = { compFunc };