"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fast_xml_parser_1 = require("fast-xml-parser");
const parse_js_1 = require("libxmljs/dist/lib/parse.js");
const parcel_bundler_1 = __importDefault(require("parcel-bundler"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const bundler = new parcel_bundler_1.default('./html/GUI.html');
// Middleware to parse text/xml body
app.use(body_parser_1.default.text({ type: 'text/xml' }));
app.post('/', (req, res) => {
    const xmlData = req.body;
    //console.log('Received XML data:', xmlData);
    // ... process the XML data ...
    //let isValid: boolean = validateXML(xmlData, mesmer_xsd, [mesmerPlugins_xsd, CMLforMesmer_xsd]);
    let isValid = validateXML(xmlData);
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
let mesmer_xsd = loadXSD('./data/schemas/mesmer.xsd');
//console.log("Loaded mesmer_xsd=" + mesmer_xsd);
//let mesmerPlugins_xsd: string = loadXSD('./data/schemas/mesmerPlugins.xsd');
//console.log("Loaded mesmerPlugins_xsd=" + mesmerPlugins_xsd);
//let CMLforMesmer_xsd: string = loadXSD('./data/schemas/CMLforMesmer.xsd');
//console.log("Loaded CMLforMesmer_xsd=" + CMLforMesmer_xsd);
/**
 * Load XSD Files
 */
function loadXSD(xsdFile) {
    console.log(`Loading XSD file: ${xsdFile}`);
    let xsd = fs_1.default.readFileSync(xsdFile, 'utf8').trim();
    try {
        (0, parse_js_1.parseXml)(xsd);
        console.log(`XSD parsed`);
    }
    catch (error) {
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
function validateXML(xmlData) {
    /*
// Concatenate main schema with imported schemas
let fullXsdData: string = mainXsdData;
for (const xsdData of importedXsdData) {
    fullXsdData += xsdData;
}
// Check fullXsdData parses.
*/
    //const xsdDoc = parseXml(mesmer_xsd, { baseUrl: "'./data/schemas/" });
    const xsdDoc = (0, parse_js_1.parseXml)(mesmer_xsd);
    console.log(`XSD parsed`);
    const xmlDoc = (0, parse_js_1.parseXml)(xmlData);
    console.log(`XML parsed`);
    fast_xml_parser_1.XMLValidator;
    // Validate XML against XSD
    let isValid;
    try {
        isValid = xmlDoc.validate(xsdDoc);
    }
    catch (error) {
        console.error(`Error validating XML: ${error}`);
        return false;
    }
    console.error(`XML is valid`);
    return isValid;
}
//# sourceMappingURL=server.js.map