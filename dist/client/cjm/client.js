"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnergy = void 0;
const util_js_1 = require("./util.js");
const xml_js_1 = require("./xml.js");
const molecule_js_1 = require("./molecule.js");
const reaction_js_1 = require("./reaction.js");
const functions_js_1 = require("./functions.js");
const html_js_1 = require("./html.js");
const canvas_js_1 = require("./canvas.js");
const classes_js_1 = require("./classes.js");
const conditions_js_1 = require("./conditions.js");
const modelParameters_js_1 = require("./modelParameters.js");
const control_js_1 = require("./control.js");
// Code for service worker for Progressive Web App (PWA).
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../../../sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
// Expected XML tags strings.
let me_title_s = 'me:title';
/**
 * For storing me.title.
 */
let title;
/**
 * For storing the XML root start tag.
 */
let mesmerStartTag;
/**
 * For storing the XML root end tag.
 */
let mesmerEndTag;
/**
 * A map of molecules with Molecule.id as key and Molecules as values.
 */
let molecules = new Map([]);
/**
 * For storing the maximum molecule energy in a reaction.
 */
let maxMoleculeEnergy = -Infinity;
/**
 * For storing the minimum molecule energy in a reaction.
 */
let minMoleculeEnergy = Infinity;
/**
 * A map of reactions with Reaction.id as keys and Reactions as values.
 */
let reactions = new Map([]);
/**
 * The header of the XML file.
 */
const header = `<?xml version="1.0" encoding="utf-8" ?>
<?xml-stylesheet type='text/xsl' href='../../mesmer2.xsl' media='other'?>
<?xml-stylesheet type='text/xsl' href='../../mesmer1.xsl' media='screen'?>`;
/**
 * The filename of the mesmer input file loaded.
 */
let input_xml_filename;
/**
 * The load button.
 */
let loadButton;
/**
 * The save button.
 */
let saveButton;
/**
 * The XML text element.
 */
let me_title;
let molecules_title;
let molecules_table;
let reactions_title;
let reactions_table;
let reactions_diagram_title;
let conditions_title;
let conditions_table;
let modelParameters_title;
let modelParameters_table;
let xml_title;
let xml_text;
/**
 * Display the XML.
 * @param {string} xml The XML to display.
 */
function displayXML(xml) {
    //console.log("xml=" + xml);
    if (xml_title != null) {
        xml_title.innerHTML = input_xml_filename;
    }
    if (xml_text != null) {
        xml_text.innerHTML = (0, xml_js_1.toHTML)(xml);
    }
}
/**
 * Parses xml to initilise molecules.
 * @param {XMLDocument} xml The XML document.
 */
function initMolecules(xml) {
    let moleculeList_s = 'moleculeList';
    console.log(moleculeList_s);
    let xml_moleculeList = (0, xml_js_1.getSingularElement)(xml, moleculeList_s);
    // Set molecules_title.
    molecules_title = document.getElementById("molecules_title");
    if (molecules_title != null) {
        molecules_title.innerHTML = "Molecules";
    }
    // xml_moleculeList should have one or more molecule elements and no other elements.
    let moleculeListTagNames = new Set();
    xml_moleculeList.childNodes.forEach(function (node) {
        moleculeListTagNames.add(node.nodeName);
    });
    if (moleculeListTagNames.size != 1) {
        if (!(moleculeListTagNames.size == 2 && moleculeListTagNames.has("#text"))) {
            console.error("moleculeListTagNames:");
            moleculeListTagNames.forEach(x => console.error(x));
            throw new Error("Additional tag names in moleculeList:");
        }
    }
    if (!moleculeListTagNames.has("molecule")) {
        throw new Error("Expecting molecule tagName but it is not present!");
    }
    let xml_molecules = xml_moleculeList.getElementsByTagName('molecule');
    let xml_molecules_length = xml_molecules.length;
    console.log("Number of molecules=" + xml_molecules_length);
    // Process each molecule.
    //xml_molecules.forEach(function (xml_molecule) { // Cannot iterate over HTMLCollectionOf like this.
    for (let i = 0; i < xml_molecules.length; i++) {
        // Set attributes.
        let attributes = (0, xml_js_1.getAttributes)(xml_molecules[i]);
        let moleculeTagNames = new Set();
        let cns = xml_molecules[i].childNodes;
        cns.forEach(function (node) {
            moleculeTagNames.add(node.nodeName);
        });
        //console.log("moleculeTagNames:");
        //moleculeTagNames.forEach(x => console.log(x));
        // Set atoms.
        const atoms = new Map();
        // Sometimes there is an individual atom not in an atomArray.
        //let xml_atomArray = xml_molecules[i].getElementsByTagName("atomArray")[0];
        //if (xml_atomArray != null) {
        moleculeTagNames.delete("atom");
        moleculeTagNames.delete("atomArray");
        let xml_atoms = xml_molecules[i].getElementsByTagName("atom");
        for (let j = 0; j < xml_atoms.length; j++) {
            let attribs = (0, xml_js_1.getAttributes)(xml_atoms[j]);
            let id = attribs.get("id");
            if (id != undefined) {
                let atom = new molecule_js_1.Atom(attribs);
                //console.log(atom.toString());
                atoms.set(id, atom);
            }
        }
        //}
        // Read bondArray.
        moleculeTagNames.delete("bond");
        moleculeTagNames.delete("bondArray");
        const bonds = new Map();
        let xml_bonds = xml_molecules[i].getElementsByTagName("bond");
        for (let j = 0; j < xml_bonds.length; j++) {
            let attribs = (0, xml_js_1.getAttributes)(xml_bonds[j]);
            let id = attribs.get("atomRefs2");
            if (id != undefined) {
                let bond = new molecule_js_1.Bond(attribs);
                //console.log(bond.toString());
                bonds.set(id, bond);
            }
        }
        // Read propertyList.
        const properties = new Map();
        // Sometimes there is a single property not in propertyList!
        //let xml_propertyList = xml_molecules[i].getElementsByTagName("propertyList")[0];
        //if (xml_propertyList != null) {
        //    let xml_properties = xml_propertyList.getElementsByTagName("property");
        moleculeTagNames.delete("property");
        moleculeTagNames.delete("propertyList");
        let xml_properties = xml_molecules[i].getElementsByTagName("property");
        for (let j = 0; j < xml_properties.length; j++) {
            let attribs = (0, xml_js_1.getAttributes)(xml_properties[j]);
            let children = xml_properties[j].children;
            if (children.length != 1) {
                throw new Error("Expecting 1 child but finding " + children.length);
            }
            let nodeAttributes = (0, xml_js_1.getAttributes)(children[0]);
            let nodeName = children[0].nodeName; // Expecting scalar or array
            let textContent = children[0].textContent;
            if (textContent == null) {
                console.error("nodeName");
                throw new Error('textContent is null');
            }
            textContent = textContent.trim();
            let dictRef = attribs.get("dictRef");
            //console.log("dictRef=" + dictRef);
            if (dictRef == null) {
                throw new Error('dictRef is null');
            }
            //console.log("fcnn=" + fcnn);
            if (nodeName == "scalar") {
                moleculeTagNames.delete("scalar");
                let value = parseFloat(textContent);
                properties.set(dictRef, new molecule_js_1.Property(attribs, new classes_js_1.NumberWithAttributes(nodeAttributes, value)));
                if (dictRef === "me:ZPE") {
                    minMoleculeEnergy = Math.min(minMoleculeEnergy, value);
                    maxMoleculeEnergy = Math.max(maxMoleculeEnergy, value);
                }
            }
            else if (nodeName == "array") {
                moleculeTagNames.delete("array");
                properties.set(dictRef, new molecule_js_1.Property(attribs, new classes_js_1.NumberArrayWithAttributes(nodeAttributes, (0, functions_js_1.toNumberArray)(textContent.split(/\s+/)), " ")));
            }
            else if (nodeName == "matrix") {
            }
            else {
                throw new Error("Unexpected nodeName: " + nodeName);
            }
        }
        let els;
        // Read energyTransferModel
        moleculeTagNames.delete("me:energyTransferModel");
        let energyTransferModel = undefined;
        els = xml_molecules[i].getElementsByTagName("me:energyTransferModel");
        if (els != null) {
            if (els.length > 0) {
                if (els.length != 1) {
                    throw new Error("energyTransferModel length=" + els.length);
                }
                let xml_deltaEDown = els[0].getElementsByTagName("me:deltaEDown");
                if (xml_deltaEDown != null) {
                    if (xml_deltaEDown.length != 1) {
                        throw new Error("deltaEDown length=" + xml_deltaEDown.length);
                    }
                    let value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_deltaEDown[0])));
                    let deltaEDown = new molecule_js_1.DeltaEDown((0, xml_js_1.getAttributes)(xml_deltaEDown[0]), value);
                    energyTransferModel = new molecule_js_1.EnergyTransferModel((0, xml_js_1.getAttributes)(els[0]), deltaEDown);
                }
            }
        }
        // Read DOSCMethod
        moleculeTagNames.delete("me:DOSCMethod");
        let dOSCMethod = undefined;
        els = xml_molecules[i].getElementsByTagName("me:DOSCMethod");
        if (els != null) {
            let el = els[0];
            if (el != null) {
                if (el != null) {
                    let type = el.getAttribute("xsi:type");
                    if (type != null) {
                        dOSCMethod = new molecule_js_1.DOSCMethod(type);
                    }
                }
            }
        }
        // Check for unexpected tags.
        moleculeTagNames.delete("#text");
        if (moleculeTagNames.size > 0) {
            console.error("Remaining moleculeTagNames:");
            moleculeTagNames.forEach(x => console.error(x));
            throw new Error("Unexpected tags in molecule.");
        }
        let molecule = new molecule_js_1.Molecule(attributes, atoms, bonds, properties, energyTransferModel, dOSCMethod);
        //console.log(molecule.toString());
        molecules.set(molecule.id, molecule);
    }
    // Add event listeners to molecules table.
    molecules.forEach(function (molecule, id) {
        let energyKey = id + "_energy";
        let inputElement = document.getElementById(energyKey);
        if (inputElement) {
            inputElement.addEventListener('change', (event) => {
                // The input is set up to call the function setEnergy(HTMLInputElement),
                // so the following commented code is not used. As the input was setup 
                // as a number type. The any non numbers were It seems that there are two 
                // ways to get and store the value of the input element.
                // Both ways have been kept for now as I don't know which way is better!
                let eventTarget = event.target;
                let inputValue = eventTarget.value;
                if ((0, functions_js_1.isNumeric)(inputValue)) {
                    molecule.setEnergy(parseFloat(inputValue));
                    console.log("Set energy of " + id + " to " + inputValue + " kJ/mol");
                }
                else {
                    alert("Energy input for " + id + " is not a number");
                    let inputElement = document.getElementById(energyKey);
                    inputElement.value = molecule.getEnergy().toString();
                    console.log("inputValue=" + inputValue);
                    console.log("Type of inputValue: " + typeof inputValue);
                }
            });
        }
    });
}
let inputElement;
function reload() {
    inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.onchange = function () {
        if (inputElement.files) {
            for (let i = 0; i < inputElement.files.length; i++) {
                console.log("inputElement.files[" + i + "]=" + inputElement.files[i]);
            }
            let file = inputElement.files[0];
            //console.log("file=" + file);
            console.log(file.name);
            input_xml_filename = file.name;
            if (xml_text != null) {
                let reader = new FileReader();
                let chunkSize = 1024 * 1024; // 1MB
                let start = 0;
                let contents = '';
                reader.onload = function (e) {
                    if (!e.target) {
                        throw new Error('Event target is null');
                    }
                    contents += e.target.result;
                    if (file != null) {
                        if (start < file.size) {
                            // Read the next chunk
                            let blob = file.slice(start, start + chunkSize);
                            reader.readAsText(blob);
                            start += chunkSize;
                        }
                        else {
                            // All chunks have been read
                            contents = contents.trim();
                            displayXML(contents);
                            let parser = new DOMParser();
                            let xml = parser.parseFromString(contents, "text/xml");
                            parse(xml);
                            // Send XML to the server
                            fetch('http://localhost:1234/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'text/xml',
                                },
                                body: contents,
                            })
                                .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.text();
                            })
                                .then(data => {
                                console.log('Server response:', data);
                            })
                                .catch(error => {
                                console.error('There was a problem with the fetch operation:', error);
                            });
                        }
                    }
                };
                // Read the first chunk
                let blob = file.slice(start, start + chunkSize);
                reader.readAsText(blob);
                start += chunkSize;
            }
        }
    };
    inputElement.click();
    // Add event listener to load button.
    loadButton = document.getElementById('load_button');
    if (loadButton != null) {
        loadButton.addEventListener('click', reload);
    }
    // Ensure save button is displayed.
    saveButton = document.getElementById('saveButton');
    if (saveButton != null) {
        saveButton.style.display = 'inline';
    }
}
/**
 * Once the DOM is loaded, set up the elements.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    // Initialise elements
    xml_title = document.getElementById("xml_title");
    xml_text = document.getElementById("xml_text");
    window.loadXML = function () {
        reload();
    };
});
/**
 * Set the title.
 * @param {XMLDocument} xml The XML document.
 */
function setTitle(xml) {
    me_title = xml.getElementsByTagName(me_title_s);
    if (me_title == null) {
        throw new Error(me_title_s + ' not found');
    }
    else {
        if (me_title.length != 1) {
            throw new Error('Multiple ' + me_title_s + ' elements found');
        }
        else {
            title = me_title[0].childNodes[0].nodeValue;
            title = title.trim();
            console.log("Title=" + title);
            let e = document.getElementById("title");
            if (e != null) {
                e.innerHTML = title;
            }
        }
    }
}
/**
 * Parse the XML.
 * @param {XMLDocument} xml
 */
function parse(xml) {
    /**
     * Set mesmer_xml start tag.
     */
    mesmerStartTag = "\n";
    let documentElement = xml.documentElement;
    if (documentElement == null) {
        throw new Error("Document element not found");
    }
    else {
        let tagName = documentElement.tagName;
        mesmerStartTag += "<" + tagName;
        console.log(tagName);
        mesmerEndTag = (0, xml_js_1.getEndTag)(tagName, "", true);
        let first = true;
        let pad = " ".repeat(tagName.length + 2);
        let names = documentElement.getAttributeNames();
        names.forEach(function (name) {
            let attribute = documentElement.getAttribute(name);
            let na = `${name}="${attribute}"`;
            if (first) {
                first = false;
                mesmerStartTag += " " + na;
            }
            else {
                mesmerStartTag += "\n" + pad + na;
            }
        });
        mesmerStartTag += ">";
        //console.log(mesmerStartTag);
    }
    /**
     *  Set title.
     */
    setTitle(xml);
    /**
     * Generate molecules table.
     */
    initMolecules(xml);
    displayMoleculesTable();
    /**
     * Generate reactions table.
     */
    initReactions(xml);
    displayReactionsTable();
    displayReactionsDiagram();
    /**
     * Generate conditions table.
     */
    initConditions(xml);
    displayConditions();
    /**
     * Generate parameters table.
     */
    initModelParameters(xml);
    displayModelParameters();
    /**
     * Generate control table.
     */
    initControl(xml);
    displayControl();
}
let conditions;
/**
 * Parse xml to initialise conditions.
 * @param {XMLDocument} xml The XML document.
 */
function initConditions(xml) {
    let me_conditions_s = 'me:conditions';
    console.log(me_conditions_s);
    let xml_conditions = (0, xml_js_1.getSingularElement)(xml, me_conditions_s);
    // Set conditions_title.
    conditions_title = document.getElementById("conditions_title");
    if (conditions_title != null) {
        conditions_title.innerHTML = "Conditions";
    }
    // BathGas
    let xml_bathGas = (0, xml_js_1.getSingularElement)(xml_conditions, 'me:bathGas');
    let attributes = (0, xml_js_1.getAttributes)(xml_bathGas);
    let bathGas = new conditions_js_1.BathGas(attributes, (0, util_js_1.get)(molecules, xml_bathGas.childNodes[0].nodeValue));
    // PTs
    let xml_PTs = (0, xml_js_1.getSingularElement)(xml_conditions, 'me:PTs');
    let xml_PTPairs = xml_PTs.getElementsByTagName('me:PTpair');
    // Process each PTpair.
    let PTs = [];
    for (let i = 0; i < xml_PTPairs.length; i++) {
        PTs.push(new conditions_js_1.PTpair((0, xml_js_1.getAttributes)(xml_PTPairs[i])));
    }
    conditions = new conditions_js_1.Conditions(bathGas, PTs);
}
let modelParameters;
/**
 * Parses xml to initialise modelParameters.
 * @param {XMLDocument} xml The XML document.
 */
function initModelParameters(xml) {
    let me_modelParameters_s = 'me:modelParameters';
    console.log(me_modelParameters_s);
    let xml_modelParameters = (0, xml_js_1.getSingularElement)(xml, me_modelParameters_s);
    // Set modelParameters_title.
    modelParameters_title = document.getElementById("modelParameters_title");
    if (modelParameters_title != null) {
        modelParameters_title.innerHTML = "Model Parameters";
    }
    // GrainSize
    let xml_grainSize = (0, xml_js_1.getSingularElement)(xml_modelParameters, 'me:grainSize');
    let attributes = (0, xml_js_1.getAttributes)(xml_grainSize);
    let value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_grainSize)));
    let grainSize = new modelParameters_js_1.GrainSize(attributes, value);
    // EnergyAboveTheTopHill
    let xml_energyAboveTheTopHill = (0, xml_js_1.getSingularElement)(xml_modelParameters, 'me:energyAboveTheTopHill');
    let energyAboveTheTopHill = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_energyAboveTheTopHill)));
    modelParameters = new modelParameters_js_1.ModelParameters(grainSize, energyAboveTheTopHill);
}
let control;
/**
 * Parses xml to initialise control.
 * @param {XMLDocument} xml The XML document.
 */
function initControl(xml) {
    let me_control_s = 'me:control';
    console.log(me_control_s);
    let xml_control = (0, xml_js_1.getSingularElement)(xml, me_control_s);
    // Set control_title.
    let control_title = document.getElementById("control_title");
    if (control_title != null) {
        control_title.innerHTML = "Control";
    }
    // me:testDOS
    let xml_testDOS = xml_control.getElementsByTagName('me:testDOS');
    let testDOS;
    if (xml_testDOS.length > 0) {
        testDOS = true;
    }
    // me:printSpeciesProfile
    let xml_printSpeciesProfile = xml_control.getElementsByTagName('me:printSpeciesProfile');
    let printSpeciesProfile;
    if (xml_printSpeciesProfile.length > 0) {
        printSpeciesProfile = true;
    }
    // me:testMicroRates
    let xml_testMicroRates = xml_control.getElementsByTagName('me:testMicroRates');
    let testMicroRates;
    if (xml_testMicroRates.length > 0) {
        testMicroRates = true;
    }
    // me:testRateConstant
    let xml_testRateConstant = xml_control.getElementsByTagName('me:testRateConstant');
    let testRateConstant;
    if (xml_testRateConstant.length > 0) {
        testRateConstant = true;
    }
    // me:printGrainDOS
    let xml_printGrainDOS = xml_control.getElementsByTagName('me:printGrainDOS');
    let printGrainDOS;
    if (xml_printGrainDOS.length > 0) {
        printGrainDOS = true;
    }
    // me:printCellDOS
    let xml_printCellDOS = xml_control.getElementsByTagName('me:printCellDOS');
    let printCellDOS;
    if (xml_printCellDOS.length > 0) {
        printCellDOS = true;
    }
    // me:printReactionOperatorColumnSums
    let xml_printReactionOperatorColumnSums = xml_control.getElementsByTagName('me:printReactionOperatorColumnSums');
    let printReactionOperatorColumnSums;
    if (xml_printReactionOperatorColumnSums.length > 0) {
        printReactionOperatorColumnSums = true;
    }
    // me:printTunnellingCoefficients
    let xml_printTunnellingCoefficients = xml_control.getElementsByTagName('me:printTunnellingCoefficients');
    let printTunnellingCoefficients;
    if (xml_printTunnellingCoefficients.length > 0) {
        printTunnellingCoefficients = true;
    }
    // me:printGrainkfE
    let xml_printGrainkfE = xml_control.getElementsByTagName('me:printGrainkfE');
    let printGrainkfE;
    if (xml_printGrainkfE.length > 0) {
        printGrainkfE = true;
    }
    // me:printGrainBoltzmann
    let xml_printGrainBoltzmann = xml_control.getElementsByTagName('me:printGrainBoltzmann');
    let printGrainBoltzmann;
    if (xml_printGrainBoltzmann.length > 0) {
        printGrainBoltzmann = true;
    }
    // me:printGrainkbE
    let xml_printGrainkbE = xml_control.getElementsByTagName('me:printGrainkbE');
    let printGrainkbE;
    if (xml_printGrainkbE.length > 0) {
        printGrainkbE = true;
    }
    // me:eigenvalues
    let xml_eigenvalues = xml_control.getElementsByTagName('me:eigenvalues');
    let eigenvalues;
    if (xml_eigenvalues.length > 0) {
        eigenvalues = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_eigenvalues[0])));
    }
    // me:hideInactive
    let xml_hideInactive = xml_control.getElementsByTagName('me:hideInactive');
    let hideInactive;
    if (xml_hideInactive.length > 0) {
        hideInactive = true;
    }
    // me:diagramEnergyOffset
    let xml_diagramEnergyOffset = xml_control.getElementsByTagName('me:diagramEnergyOffset');
    let diagramEnergyOffset;
    if (xml_diagramEnergyOffset.length > 0) {
        let value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_diagramEnergyOffset[0])));
        diagramEnergyOffset = new control_js_1.DiagramEnergyOffset((0, xml_js_1.getAttributes)(xml_diagramEnergyOffset[0]), value);
    }
    control = new control_js_1.Control(testDOS, printSpeciesProfile, testMicroRates, testRateConstant, printGrainDOS, printCellDOS, printReactionOperatorColumnSums, printTunnellingCoefficients, printGrainkfE, printGrainBoltzmann, printGrainkbE, eigenvalues, hideInactive, diagramEnergyOffset);
}
/**
 * Parses xml to initialise reactions.
 * @param {XMLDocument} xml The XML document.
 */
function initReactions(xml) {
    let reactionList_s = 'reactionList';
    console.log(reactionList_s);
    let xml_reactionList = (0, xml_js_1.getSingularElement)(xml, reactionList_s);
    let xml_reactions = xml_reactionList.getElementsByTagName('reaction');
    let xml_reactions_length = xml_reactions.length;
    console.log("Number of reactions=" + xml_reactions_length);
    // Process each reaction.
    if (xml_reactions_length == 0) {
        //return;
        throw new Error("No reactions: There should be at least 1!");
    }
    // Set reactions_title.
    reactions_title = document.getElementById("reactions_title");
    if (reactions_title != null) {
        reactions_title.innerHTML = "Reactions";
    }
    for (let i = 0; i < xml_reactions_length; i++) {
        let attributes = (0, xml_js_1.getAttributes)(xml_reactions[i]);
        let reactionID = attributes.get("id");
        if (reactionID == null) {
            throw new Error("reactionID is null");
        }
        if (reactionID != null) {
            console.log("id=" + reactionID);
            // Load reactants.
            let reactants = new Map([]);
            let xml_reactants = xml_reactions[i].getElementsByTagName('reactant');
            //console.log("xml_reactants.length=" + xml_reactants.length);
            for (let j = 0; j < xml_reactants.length; j++) {
                let xml_molecule = (0, xml_js_1.getFirstElement)(xml_reactants[j], 'molecule');
                let moleculeID = (0, xml_js_1.getAttribute)(xml_molecule, "ref");
                reactants.set(moleculeID, new reaction_js_1.Reactant((0, xml_js_1.getAttributes)(xml_molecule), (0, util_js_1.get)(molecules, moleculeID)));
            }
            // Load products.
            let products = new Map([]);
            let xml_products = xml_reactions[i].getElementsByTagName('product');
            //console.log("xml_products.length=" + xml_products.length);
            for (let j = 0; j < xml_products.length; j++) {
                let xml_molecule = (0, xml_js_1.getFirstElement)(xml_products[j], 'molecule');
                let moleculeID = (0, xml_js_1.getAttribute)(xml_molecule, "ref");
                products.set(moleculeID, new reaction_js_1.Product((0, xml_js_1.getAttributes)(xml_molecule), (0, util_js_1.get)(molecules, moleculeID)));
            }
            // Load MCRCMethod.
            //console.log("Load MCRCMethod...");
            let mCRCMethod;
            let xml_MCRCMethod = xml_reactions[i].getElementsByTagName('me:MCRCMethod');
            //console.log("xml_MCRCMethod=" + xml_MCRCMethod);
            //console.log("xml_MCRCMethod.length=" + xml_MCRCMethod.length);
            if (xml_MCRCMethod.length > 0) {
                let attributes = (0, xml_js_1.getAttributes)(xml_MCRCMethod[0]);
                let name = attributes.get("name");
                if (name == null) {
                    let type = attributes.get("xsi:type");
                    if (type != null) {
                        if (type === "me:MesmerILT") {
                            let preExponential;
                            let xml_preExponential = xml_MCRCMethod[0].getElementsByTagName("me:preExponential");
                            if (xml_preExponential != null) {
                                if (xml_preExponential[0] != null) {
                                    let value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_preExponential[0])));
                                    preExponential = new reaction_js_1.PreExponential((0, xml_js_1.getAttributes)(xml_preExponential[0]), value);
                                }
                            }
                            let activationEnergy;
                            let xml_activationEnergy = xml_MCRCMethod[0].getElementsByTagName("me:activationEnergy");
                            if (xml_activationEnergy != null) {
                                if (xml_activationEnergy[0] != null) {
                                    let value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_activationEnergy[0])));
                                    activationEnergy = new reaction_js_1.ActivationEnergy((0, xml_js_1.getAttributes)(xml_activationEnergy[0]), value);
                                }
                            }
                            let tInfinity;
                            let xml_tInfinity = xml_MCRCMethod[0].getElementsByTagName("me:TInfinity");
                            if (xml_tInfinity != null) {
                                if (xml_tInfinity[0] != null) {
                                    let value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_tInfinity[0])));
                                    tInfinity = new reaction_js_1.NInfinity((0, xml_js_1.getAttributes)(xml_tInfinity[0]), value);
                                }
                            }
                            let nInfinity;
                            let xml_nInfinity = xml_MCRCMethod[0].getElementsByTagName("me:nInfinity");
                            if (xml_nInfinity != null) {
                                if (xml_nInfinity[0] != null) {
                                    let value = parseFloat((0, xml_js_1.getNodeValue)((0, xml_js_1.getFirstChildNode)(xml_nInfinity[0])));
                                    nInfinity = new reaction_js_1.NInfinity((0, xml_js_1.getAttributes)(xml_nInfinity[0]), value);
                                }
                            }
                            mCRCMethod = new reaction_js_1.MesmerILT(attributes, preExponential, activationEnergy, tInfinity, nInfinity);
                        }
                    }
                }
                else {
                    mCRCMethod = new reaction_js_1.MCRCMethod(attributes, name);
                }
            }
            // Load transition state.
            //console.log("Load  transition state...");
            let xml_transitionState = xml_reactions[i].getElementsByTagName('me:transitionState');
            let transitionState;
            if (xml_transitionState.length > 0) {
                let xml_molecule = xml_transitionState[0].getElementsByTagName('molecule')[0];
                let moleculeID = xml_molecule.getAttribute("ref");
                transitionState = new reaction_js_1.TransitionState((0, xml_js_1.getAttributes)(xml_molecule), (0, util_js_1.get)(molecules, moleculeID));
                //console.log("transitionState moleculeID=" + transitionState.molecule.getID());
                //console.log("transitionState role=" + transitionState.attributes.get("role"));
            }
            // Load tunneling.
            let xml_tunneling = xml_reactions[i].getElementsByTagName('me:tunneling');
            let tunneling;
            if (xml_tunneling.length > 0) {
                tunneling = new reaction_js_1.Tunneling((0, xml_js_1.getAttributes)(xml_tunneling[0]));
            }
            let reaction = new reaction_js_1.Reaction(attributes, reactionID, reactants, products, mCRCMethod, transitionState, tunneling);
            reactions.set(reactionID, reaction);
            //console.log("reaction=" + reaction);
        }
    }
}
/**
 * Create a diagram.
 * @param {Map<string, Molecule>} molecules The molecules.
 * @param {Map<string, Reaction>} reactions The reactions.
 * @param {boolean} dark True for dark mode.
 * @returns {HTMLCanvasElement} The diagram.
 * @param {string} font The font to use.
 * @param {number} lw The line width of reactants, transition states and products.
 * @param {string} lwc The line width color to use.
 */
function drawReactionDiagram(canvas, molecules, reactions, dark, font, lw, lwc) {
    console.log("drawReactionDiagram");
    // TODO: Set styles depending on dark/light mode settings of users browser and not hard code.
    //let white = "white";
    let black = "black";
    let green = "green";
    let red = "red";
    let blue = "blue";
    //let yellow = "yellow";
    let orange = "orange";
    let background = "black";
    let foreground = "white";
    const ctx = canvas.getContext("2d");
    //ctx.fillStyle = background;
    // Get text height for font size.
    let th = (0, canvas_js_1.getTextHeight)(ctx, "Aj", font);
    //console.log("th=" + th);
    // Go through reactions:
    // 1. Create sets of reactants, end products, intermediate products and transition states.
    // 2. Create maps of orders and energies.
    // 3. Calculate maximum energy.
    let reactants = new Set();
    let products = new Set();
    let intProducts = new Set();
    let transitionStates = new Set();
    let orders = new Map();
    let energies = new Map();
    let i = 0;
    let energyMin = Number.MAX_VALUE;
    let energyMax = Number.MIN_VALUE;
    reactions.forEach(function (reaction, id) {
        // Get TransitionState if there is one.
        let transitionState = reaction.transitionState;
        //console.log("reactant=" + reactant);
        let reactantsLabel = reaction.getReactantsLabel();
        reactants.add(reactantsLabel);
        if (products.has(reactantsLabel)) {
            intProducts.add(reactantsLabel);
        }
        let energy = reaction.getReactantsEnergy();
        energyMin = Math.min(energyMin, energy);
        energyMax = Math.max(energyMax, energy);
        energies.set(reactantsLabel, energy);
        let productsLabel = reaction.getProductsLabel();
        products.add(productsLabel);
        energy = reaction.getProductsEnergy();
        energyMin = Math.min(energyMin, energy);
        energyMax = Math.max(energyMax, energy);
        energies.set(productsLabel, energy);
        if (!orders.has(reactantsLabel)) {
            orders.set(reactantsLabel, i);
            i++;
        }
        if (orders.has(productsLabel)) {
            i--;
            let j = (0, util_js_1.get)(orders, productsLabel);
            // Move product to end and shift everything back.
            orders.forEach(function (value, key) {
                if (value > j) {
                    orders.set(key, value - 1);
                }
            });
            // Insert transition state.
            if (transitionState != undefined) {
                let tsn = transitionState.getRef();
                transitionStates.add(tsn);
                orders.set(tsn, i);
                energy = transitionState.molecule.getEnergy();
                energyMin = Math.min(energyMin, energy);
                energyMax = Math.max(energyMax, energy);
                energies.set(tsn, energy);
                i++;
            }
            orders.set(productsLabel, i);
            i++;
        }
        else {
            if (transitionState != undefined) {
                let tsn = transitionState.getRef();
                transitionStates.add(tsn);
                orders.set(tsn, i);
                energy = transitionState.molecule.getEnergy();
                energyMin = Math.min(energyMin, energy);
                energyMax = Math.max(energyMax, energy);
                energies.set(tsn, energy);
                i++;
            }
            orders.set(productsLabel, i);
            i++;
        }
    });
    //console.log("orders=" + mapToString(orders));
    //console.log("energies=" + mapToString(energies));
    //console.log("energyMax=" + energyMax);
    //console.log("energyMin=" + energyMin);
    let energyRange = energyMax - energyMin;
    //console.log("energyRange=" + energyRange);
    //console.log("reactants=" + reactants);
    //console.log("products=" + products);
    //console.log("transitionStates=" + transitionStates);
    // Create a lookup from order to label.
    let reorders = [];
    orders.forEach(function (value, key) {
        reorders[value] = key;
    });
    //console.log("reorders=" + arrayToString(reorders));
    // Iterate through the reorders:
    // 1. Capture coordinates for connecting lines.
    // 2. Store maximum x.
    let x0 = 0;
    let y0;
    let x1;
    let y1;
    let xmax = 0;
    let tw;
    let textSpacing = 5; // Spacing between end of line and start of text.
    let stepSpacing = 10; // Spacing between steps.
    let reactantsInXY = new Map();
    let reactantsOutXY = new Map();
    let productsInXY = new Map();
    let productsOutXY = new Map();
    let transitionStatesInXY = new Map();
    let transitionStatesOutXY = new Map();
    reorders.forEach(function (value) {
        //console.log("value=" + value + ".");
        //console.log("energies=" + mapToString(energies));
        let energy = (0, util_js_1.get)(energies, value);
        let energyRescaled = (0, util_js_1.rescale)(energyMin, energyRange, 0, canvas.height, energy);
        // Get text width.
        tw = Math.max((0, canvas_js_1.getTextWidth)(ctx, energy.toString(), font), (0, canvas_js_1.getTextWidth)(ctx, value, font));
        x1 = x0 + tw + textSpacing;
        y0 = energyRescaled + lw;
        y1 = y0;
        // Draw horizontal line and add label.
        // (The drawing is now not done here but done later so labels are on top of lines.)
        // The code is left here commented out for reference.
        //drawLevel(ctx, green, 4, x0, y0, x1, y1, th, value);
        reactantsInXY.set(value, [x0, y0]);
        reactantsOutXY.set(value, [x1, y1]);
        if (products.has(value)) {
            productsInXY.set(value, [x0, y0]);
            productsOutXY.set(value, [x1, y1]);
        }
        if (transitionStates.has(value)) {
            transitionStatesInXY.set(value, [x0, y0]);
            transitionStatesOutXY.set(value, [x1, y1]);
        }
        x0 = x1 + stepSpacing;
        xmax = x1;
    });
    // Set canvas width to maximum x.
    canvas.width = xmax;
    //console.log("canvas.width=" + canvas.width);
    // Set canvas height to maximum energy plus the label.
    let canvasHeightWithBorder = canvas.height + (4 * th) + (2 * lw);
    //console.log("canvasHeightWithBorder=" + canvasHeightWithBorder);
    let originalCanvasHeight = canvas.height;
    // Update the canvas height.
    canvas.height = canvasHeightWithBorder;
    // Set the transformation matrix.
    //ctx.transform(1, 0, 0, 1, 0, canvasHeightWithBorder);
    ctx.transform(1, 0, 0, -1, 0, canvasHeightWithBorder);
    // Go through reactions and draw connecting lines.
    reactions.forEach(function (reaction, id) {
        //console.log("id=" + id);
        //console.log("reaction=" + reaction);
        // Get TransitionState if there is one.
        let transitionState = reaction.transitionState;
        //console.log("reactant=" + reactant);
        let reactantsLabel = reaction.getReactantsLabel();
        let productsLabel = reaction.getProductsLabel();
        let reactantOutXY = (0, util_js_1.get)(reactantsOutXY, reactantsLabel);
        let productInXY = (0, util_js_1.get)(productsInXY, productsLabel);
        if (transitionState != undefined) {
            let transitionStateLabel = transitionState.getRef();
            let transitionStateInXY = (0, util_js_1.get)(transitionStatesInXY, transitionStateLabel);
            (0, canvas_js_1.drawLine)(ctx, black, lwc, reactantOutXY[0], reactantOutXY[1], transitionStateInXY[0], transitionStateInXY[1]);
            let transitionStateOutXY = (0, util_js_1.get)(transitionStatesOutXY, transitionStateLabel);
            (0, canvas_js_1.drawLine)(ctx, black, lwc, transitionStateOutXY[0], transitionStateOutXY[1], productInXY[0], productInXY[1]);
        }
        else {
            (0, canvas_js_1.drawLine)(ctx, black, lwc, reactantOutXY[0], reactantOutXY[1], productInXY[0], productInXY[1]);
        }
    });
    // Draw horizontal lines and labels.
    // (This is done last so that the labels are on top of the vertical lines.)
    reactants.forEach(function (value) {
        let energy = (0, util_js_1.get)(energies, value);
        let energyRescaled = (0, util_js_1.rescale)(energyMin, energyRange, 0, originalCanvasHeight, energy);
        let x0 = (0, util_js_1.get)(reactantsInXY, value)[0];
        let y = energyRescaled + lw;
        let x1 = (0, util_js_1.get)(reactantsOutXY, value)[0];
        let energyString = energy.toString();
        (0, canvas_js_1.drawLevel)(ctx, blue, lw, x0, y, x1, y, font, th, value, energyString);
    });
    products.forEach(function (value) {
        let energy = (0, util_js_1.get)(energies, value);
        let energyRescaled = (0, util_js_1.rescale)(energyMin, energyRange, 0, originalCanvasHeight, energy);
        let x0 = (0, util_js_1.get)(productsInXY, value)[0];
        let y = energyRescaled + lw;
        let x1 = (0, util_js_1.get)(productsOutXY, value)[0];
        let energyString = energy.toString();
        if (intProducts.has(value)) {
            (0, canvas_js_1.drawLevel)(ctx, orange, lw, x0, y, x1, y, font, th, value, energyString);
        }
        else {
            (0, canvas_js_1.drawLevel)(ctx, green, lw, x0, y, x1, y, font, th, value, energyString);
        }
    });
    transitionStates.forEach(function (value) {
        let v;
        let energy = (0, util_js_1.get)(energies, value);
        let energyRescaled = (0, util_js_1.rescale)(energyMin, energyRange, 0, originalCanvasHeight, energy);
        let x0 = (0, util_js_1.get)(transitionStatesInXY, value)[0];
        let y = energyRescaled + lw;
        let x1 = (0, util_js_1.get)(transitionStatesOutXY, value)[0];
        let energyString = energy.toString();
        (0, canvas_js_1.drawLevel)(ctx, red, lw, x0, y, x1, y, font, th, value, energyString);
    });
}
/**
 * Display molecules table.
 */
function displayMoleculesTable() {
    if (molecules.size == 0) {
        return;
    }
    // Prepare table headings.
    let moleculesTable = (0, html_js_1.getTH)([
        "Name",
        "Energy<br>kJ/mol",
        "Rotation constants<br>cm<sup>-1</sup>",
        "Vibration frequencies<br>cm<sup>-1</sup>"
    ]);
    molecules.forEach(function (molecule, id) {
        //console.log("id=" + id);
        //console.log("molecule=" + molecule);
        let energyNumber = molecule.getEnergy();
        let energy;
        if (energyNumber == null) {
            energy = "";
        }
        else {
            energy = energyNumber.toString();
        }
        //console.log("energy=" + energy);
        let rotationConstants = "";
        let rotConsts = molecule.getRotationConstants();
        if (rotConsts != undefined) {
            rotationConstants = (0, functions_js_1.arrayToString)(rotConsts, " ");
        }
        let vibrationFrequencies = "";
        let vibFreqs = molecule.getVibrationFrequencies();
        if (vibFreqs != undefined) {
            vibrationFrequencies = (0, functions_js_1.arrayToString)(vibFreqs, " ");
        }
        moleculesTable += (0, html_js_1.getTR)((0, html_js_1.getTD)(id)
            + (0, html_js_1.getTD)((0, html_js_1.getInput)("number", id + "_energy", "setEnergy(this)", energy))
            + (0, html_js_1.getTD)(rotationConstants, true)
            + (0, html_js_1.getTD)(vibrationFrequencies, true));
    });
    molecules_table = document.getElementById("molecules_table");
    if (molecules_table !== null) {
        molecules_table.innerHTML = moleculesTable;
    }
}
/**
 * Display reactions table.
 */
function displayReactionsTable() {
    if (reactions.size == 0) {
        return;
    }
    // Prepare table headings.
    let reactionsTable = (0, html_js_1.getTH)(["ID", "Reactants", "Products", "Transition State",
        "PreExponential", "Activation Energy", "TInfinity", "NInfinity"]);
    reactions.forEach(function (reaction, id) {
        //console.log("id=" + id);
        //console.log("reaction=" + reaction);
        let reactants = (0, functions_js_1.arrayToString)(Array.from(reaction.reactants.keys()), " ");
        let products = (0, functions_js_1.arrayToString)(Array.from(reaction.products.keys()), " ");
        let transitionState = "";
        let preExponential = "";
        let activationEnergy = "";
        let tInfinity = "";
        let nInfinity = "";
        if (reaction.transitionState != undefined) {
            let name = reaction.transitionState.attributes.get("name");
            if (name != null) {
                transitionState = name;
            }
        }
        if (reaction.mCRCMethod != undefined) {
            if (reaction.mCRCMethod instanceof reaction_js_1.MesmerILT) {
                if (reaction.mCRCMethod.preExponential != null) {
                    preExponential = reaction.mCRCMethod.preExponential.value.toString() + " "
                        + reaction.mCRCMethod.preExponential.attributes.get("units");
                }
                if (reaction.mCRCMethod.activationEnergy != null) {
                    activationEnergy = reaction.mCRCMethod.activationEnergy.value.toString() + " "
                        + reaction.mCRCMethod.activationEnergy.attributes.get("units");
                }
                if (reaction.mCRCMethod.tInfinity != null) {
                    tInfinity = reaction.mCRCMethod.tInfinity.toString();
                }
                if (reaction.mCRCMethod.nInfinity != null) {
                    nInfinity = reaction.mCRCMethod.nInfinity.value.toString();
                }
            }
            else {
                if (reaction.mCRCMethod.attributes.get("name") == "RRKM") {
                }
                else {
                    throw new Error("Unexpected mCRCMethod: " + reaction.mCRCMethod);
                }
            }
        }
        reactionsTable += (0, html_js_1.getTR)((0, html_js_1.getTD)(id) + (0, html_js_1.getTD)(reactants) + (0, html_js_1.getTD)(products) + (0, html_js_1.getTD)(transitionState)
            + (0, html_js_1.getTD)(preExponential, true) + (0, html_js_1.getTD)(activationEnergy, true) + (0, html_js_1.getTD)(tInfinity, true)
            + (0, html_js_1.getTD)(nInfinity, true));
        reactions_table = document.getElementById("reactions_table");
        if (reactions_table !== null) {
            reactions_table.innerHTML = reactionsTable;
        }
    });
}
/**
 * Display reactions diagram.
 */
function displayReactionsDiagram() {
    if (reactions.size > 1) {
        // Set reactions_diagram_title.
        reactions_diagram_title = document.getElementById("reactions_diagram_title");
        if (reactions_diagram_title != null) {
            reactions_diagram_title.innerHTML = "Diagram";
        }
        // Display the diagram.
        let canvas = document.getElementById("reactions_diagram");
        let font = "14px Arial";
        let dark = true;
        let lw = 4;
        let lwc = 2;
        if (canvas != null) {
            canvas.style.display = "block";
            drawReactionDiagram(canvas, molecules, reactions, dark, font, lw, lwc);
        }
    }
}
/**
 * Display conditions.
 */
function displayConditions() {
    let bathGas_element = document.getElementById("bathGas");
    if (bathGas_element != null) {
        bathGas_element.innerHTML = "Bath Gas " + conditions.bathGas.molecule.getID();
    }
    let PTs_element = document.getElementById("PT_table");
    let table = (0, html_js_1.getTH)(["P", "T"]);
    if (PTs_element != null) {
        conditions.pTs.forEach(function (pTpair) {
            table += (0, html_js_1.getTR)((0, html_js_1.getTD)(pTpair.P.toString()) + (0, html_js_1.getTD)(pTpair.T.toString()));
        });
        PTs_element.innerHTML = table;
    }
}
/**
 * Display modelParameters.
 */
function displayModelParameters() {
    let modelParameters_element = document.getElementById("modelParameters_table");
    let table = (0, html_js_1.getTH)(["Parameter", "Value"]);
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("Grain Size") + (0, html_js_1.getTD)(modelParameters.grainSize.value.toString()));
    table += (0, html_js_1.getTR)((0, html_js_1.getTD)("Energy Above The Top Hill") + (0, html_js_1.getTD)(modelParameters.energyAboveTheTopHill.toString()));
    if (modelParameters_element != null) {
        modelParameters_element.innerHTML = table;
    }
}
/**
 * Display control.
 */
function displayControl() {
    let control_table_element = document.getElementById("control_table");
    let table = (0, html_js_1.getTH)(["Control", "Value"]);
    if (control.testDOS != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.testDOS") + (0, html_js_1.getTD)(""));
    }
    if (control.printSpeciesProfile != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printSpeciesProfile") + (0, html_js_1.getTD)(""));
    }
    if (control.testMicroRates != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.testMicroRates") + (0, html_js_1.getTD)(""));
    }
    if (control.testRateConstant != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.testRateConstant") + (0, html_js_1.getTD)(""));
    }
    if (control.printGrainDOS != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printGrainDOS") + (0, html_js_1.getTD)(""));
    }
    if (control.printCellDOS != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printCellDOS") + (0, html_js_1.getTD)(""));
    }
    if (control.printReactionOperatorColumnSums != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printReactionOperatorColumnSums") + (0, html_js_1.getTD)(""));
    }
    if (control.printTunnellingCoefficients != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printTunnellingCoefficients") + (0, html_js_1.getTD)(""));
    }
    if (control.printGrainkfE != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printGrainkfE") + (0, html_js_1.getTD)(""));
    }
    if (control.printGrainBoltzmann != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printGrainBoltzmann") + (0, html_js_1.getTD)(""));
    }
    if (control.printGrainkbE != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.printGrainkbE") + (0, html_js_1.getTD)(""));
    }
    if (control.eigenvalues != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.eigenvalues") + (0, html_js_1.getTD)(control.eigenvalues.toString()));
    }
    if (control.hideInactive != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.hideInactive") + (0, html_js_1.getTD)(""));
    }
    if (control.diagramEnergyOffset != undefined) {
        table += (0, html_js_1.getTR)((0, html_js_1.getTD)("me.diagramEnergyOffset") + (0, html_js_1.getTD)(control.diagramEnergyOffset.value.toString()));
    }
    if (control_table_element != null) {
        control_table_element.innerHTML = table;
    }
}
/**
 * Set the energy of a molecule when the energy input value is changed.
 * @param input The input element.
 */
function setEnergy(input) {
    let id_energy = input.id;
    let moleculeID = id_energy.split("_")[0];
    let molecule = molecules.get(moleculeID);
    if (molecule != undefined) {
        let inputValue = parseFloat(input.value);
        if (!isNaN(inputValue)) {
            molecule.setEnergy(inputValue);
            console.log("Energy of " + moleculeID + " set to " + inputValue);
        }
        else {
            alert("Energy input for " + moleculeID + " is not a number");
            let inputElement = document.getElementById(id_energy);
            inputElement.value = molecule.getEnergy().toString();
        }
        //console.log("molecule=" + molecule);
    }
}
exports.setEnergy = setEnergy;
window.setEnergy = setEnergy;
/**
 * Save to XML file.
 */
window.saveXML = function () {
    console.log("saveXML");
    const pad = "  ";
    let level;
    const padding2 = pad.repeat(2);
    // Create me.title.
    let title_xml = "\n" + pad + (0, xml_js_1.getTag)(title, "me:title");
    // Create moleculeList.
    level = 2;
    let moleculeList = "";
    molecules.forEach(function (molecule, id) {
        moleculeList += molecule.toXML("molecule", pad, level);
    });
    moleculeList = (0, xml_js_1.getTag)(moleculeList, "moleculeList", undefined, undefined, undefined, pad, true);
    // Create reactionList.
    level = 2;
    let reactionList = "";
    reactions.forEach(function (reaction, id) {
        reactionList += reaction.toXML("reaction", pad, level);
    });
    reactionList = (0, xml_js_1.getTag)(reactionList, "reactionList", undefined, undefined, undefined, pad, true);
    // Create me.Conditions
    let xml_conditions = conditions.toXML(pad, pad);
    // Create modelParameters
    let xml_modelParameters = modelParameters.toXML(pad, pad);
    // create me.control
    let xml_control = control.toXML(pad, pad);
    // Create a new Blob object from the data
    let blob = new Blob([header, mesmerStartTag, title_xml, moleculeList, reactionList,
        xml_conditions, xml_modelParameters, xml_control, mesmerEndTag], { type: "text/plain" });
    // Create a new object URL for the blob
    let url = URL.createObjectURL(blob);
    // Create a new 'a' element
    let a = document.createElement("a");
    // Set the href and download attributes for the 'a' element
    a.href = url;
    a.download = input_xml_filename; // Replace with your desired filename
    // Append the 'a' element to the body and click it to start the download
    document.body.appendChild(a);
    a.click();
    // Remove the 'a' element after the download starts
    document.body.removeChild(a);
};
//# sourceMappingURL=client.js.map