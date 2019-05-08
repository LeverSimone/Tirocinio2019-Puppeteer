async function compFunc(page, structure, component, tag) {
    let node = await page.$$(tag);
    let attrNode = null;

    let resources = [];
    let attributes = [];

    let temp = null;
    for (let i = 0; i < node.length; i++) {
        //prendo le resource per ogni nodo
        resources[i] = await page.evaluate((obj) => { return obj.getAttribute('bot-resource'); }, node[i]);

        //prendo classe e id dal nodo per usarli per identificarlo
        let clas = await page.evaluate((obj) => { return obj.getAttribute('class'); }, node[i]);
        let id = await page.evaluate((obj) => { return obj.id; }, node[i]);
        let tagName = await page.evaluate((obj) => { return obj.tagName; }, node[i]);

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

        //inserisco la classe, id, NomeTag per riconoscere meglio il nodo
        let tagToUse = tagName;

        if(tag == '[role=\'list\']') {  tagToUse += tag;    }
        if(id) {  tagToUse += "#"+id;    }
        if(clas) {  tagToUse += "."+clas;    }

        structure.push({ component: component, resource: resources[i], attributes: attributes, selector: tagToUse });
    }
}

module.exports = { compFunc };