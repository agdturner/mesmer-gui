
import express from 'express';
import bodyParser from 'body-parser';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { parseXml } from 'libxmljs/dist/lib/parse.js';
import Bundler from 'parcel-bundler';
import fs from 'fs';

const app = express();
const bundler = new Bundler('./html/GUI.html');

// Middleware to parse text/xml body
app.use(bodyParser.text({ type: 'text/xml' }));

app.post('/', (req, res) => {
    const xmlData = req.body;
    //console.log('Received XML data:', xmlData);

    // ... process the XML data ...
    //let isValid: boolean = validateXML(xmlData, mesmer_xsd, [mesmerPlugins_xsd, CMLforMesmer_xsd]);
    let isValid: boolean = validateXML(xmlData);

    //res.send('XML data received');
    res.send('XML data received is valid: ' + isValid);
});

// Use parcel-bundler middleware to serve bundled files
app.use(bundler.middleware());

app.listen(1234, () => {
    console.log('Server running at http://localhost:1234');
});


// Load Mesmer XSD Schema files.
//const mesmer_xsd = parseXml('./data/schemas/mesmer.xsd', { baseUrl: "'./data/schemas/" });

let mesmer_xsd: string = loadXSD('./data/schemas/mesmer.xsd');
//console.log("Loaded mesmer_xsd=" + mesmer_xsd);

//let mesmerPlugins_xsd: string = loadXSD('./data/schemas/mesmerPlugins.xsd');
//console.log("Loaded mesmerPlugins_xsd=" + mesmerPlugins_xsd);

//let CMLforMesmer_xsd: string = loadXSD('./data/schemas/CMLforMesmer.xsd');
//console.log("Loaded CMLforMesmer_xsd=" + CMLforMesmer_xsd);

/**
 * Load XSD Files
 */
function loadXSD(xsdFile: string): string {
    console.log(`Loading XSD file: ${xsdFile}`);
    let xsd:string =  fs.readFileSync(xsdFile, 'utf8').trim();
    try {
        parseXml(xsd);
        console.log(`XSD parsed`);
    } catch (error) {
        console.error(`Error parsing XSD: ${error}`);
    }
    return xsd;
}


/**
 * Validates XML data against a main XSD schema and any number of imported XSD schemas.
 *
 * @param {string} xmlData The XML data to validate, as a string.
 * @param {string} mainXsdData The main XSD schema to validate against, as a string.
 * @param {string[]} importedXsdData An array of strings, each string being an imported XSD schema.
 *
 * @returns A boolean indicating whether the XML data is valid according to the XSD schemas.
 * If the XML data is not valid, the function also logs the validation errors to the console
 */
//function validateXML(xmlData: string, mainXsdData: string, importedXsdData: string[]): boolean {
function validateXML(xmlData: string): boolean {
        /*
    // Concatenate main schema with imported schemas
    let fullXsdData: string = mainXsdData;
    for (const xsdData of importedXsdData) {
        fullXsdData += xsdData;
    }
    // Check fullXsdData parses.
    */
    //const xsdDoc = parseXml(mesmer_xsd, { baseUrl: "'./data/schemas/" });
    const xsdDoc = parseXml(mesmer_xsd);
    console.log(`XSD parsed`);

    const xmlDoc = parseXml(xmlData);
    console.log(`XML parsed`);

    XMLValidator
    // Validate XML against XSD
    let isValid: boolean;    
    try {
        isValid = xmlDoc.validate(xsdDoc) as boolean;
    } catch (error) {
        console.error(`Error validating XML: ${error}`);
        return false;
    }
    
    console.error(`XML is valid`);

    return isValid;
}