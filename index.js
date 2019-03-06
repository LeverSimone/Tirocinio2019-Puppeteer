const puppeteer = require('puppeteer');
const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const GLOBAL_SETTINGS = require("./global_settings.js");
const MY_FUNCTIONS = require("./function.js");

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
})

app.post('/opensite', async (req, res) => {
    //contiene il sito da aprire
    let body = req.body;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    if (body.site) {
        try {
            //apro il sito
            await page.goto(body.site);

            //tag che vogliamo riconoscere
            let componentList = [{component: "list", tag: ['ul', 'ol', '[role="list"]']}, {component: "table", tag: ['table']}, {component: "form", tag: ['form']}];
            let structure = [];
            //prendiamo la struttura del sito composta da component e resources
            for (let i = 0; i < componentList.length; i++) {
                for (let j = 0; j < componentList[i].tag.length; j++) {
                    //prende ogni component costituito dallo stesso tag in una chiamata, ex: 'ul'
                    await MY_FUNCTIONS.compFunc(page, structure, componentList[i].component, componentList[i].tag[j]);
                }
            }

            let structureToSend = {intents: structure};

            res.json(structureToSend);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    else {
        res.status(400).send("You have to send a site");
    }

    await browser.close();
})

app.listen(GLOBAL_SETTINGS.PORT, () => console.log('Example app listening on port ' + GLOBAL_SETTINGS.PORT))