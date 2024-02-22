import { get, rescale } from './util.js';

import {
    getAttribute, getFirstElement, getFirstChildNode, getNodeValue, getTag, getEndTag, getAttributes
} from './xml.js';

import {
    Molecule, Atom, Bond, EnergyTransferModel, DeltaEDown, DOSCMethod, Property
} from './molecule.js';

import {
    Reaction, TransitionState, Reactant, Product, MCRCMethod, MesmerILT,
    PreExponential, ActivationEnergy, NInfinity, ZhuNakamuraCrossing, Tunneling
} from './reaction.js';

import {
    arrayToString, toNumberArray, isNumeric
} from './functions.js';

import {
    getTD, getTH, getTR, getInput
} from './html.js';

import {
    drawLevel,
    drawLine,
    getTextHeight, getTextWidth
} from './canvas.js';
import { NumberArrayWithAttributes, NumberWithAttributes } from './classes.js';
import { create } from 'domain';

//declare var global: any;
//const globalScope = (typeof global !== 'undefined') ? global : window;

//if (typeof global === 'undefined') {
//    (window as any).global = window;
//}

declare global {
    interface Window {
        loadXML(): void;
        saveXML(): void;
    }
}

/**
 * For storing me.title.
 */
let title: string;

/**
 * For storing the XML root start tag.
 */
let mesmerStartTag: string;

/**
 * For storing the XML root end tag.
 */
let mesmerEndTag: string;

/**
 * A map of molecules with Molecule.id as key and Molecules as values.
 */
let molecules: Map<string, Molecule> = new Map([]);

/**
 * For storing the maximum molecule energy in a reaction.
 */
let maxMoleculeEnergy: number = -Infinity;

/**
 * For storing the minimum molecule energy in a reaction.
 */
let minMoleculeEnergy: number = Infinity;

/**
 * A map of reactions with Reaction.id as keys and Reactions as values.
 */
let reactions: Map<string, Reaction> = new Map([]);

/**
 * The header of the XML file.
 */
const header: string = `<?xml version="1.0" encoding="utf-8" ?>
<?xml-stylesheet type='text/xsl' href='../../mesmer2.xsl' media='other'?>
<?xml-stylesheet type='text/xsl' href='../../mesmer1.xsl' media='screen'?>`;

/**
 * The filename of the mesmer input file loaded.
 */
let input_xml_filename: string;

document.addEventListener('DOMContentLoaded', (event) => {

    const xmlTextElement = document.getElementById("xml_text");

    window.loadXML = function () {
        //(window as any).loadXML = function () {
        /*
        document.getElementById('openFilePicker').addEventListener('click', function() {
            document.getElementById('filePicker').click();
        });
        */

        let inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.onchange = function () {
            if (inputElement.files) {
                for (let i = 0; i < inputElement.files.length; i++) {
                    console.log("inputElement.files[" + i + "]=" + inputElement.files[i]);
                }
                let file: File | null = inputElement.files[0];
                //console.log("file=" + file);
                /*
                if (file) {
                    console.log(file.name);
                    if (xmlTextElement) {
                        //xmlTextElement.innerHTML = load('/src/data/examples/AcetylO2/Acetyl_O2_associationEx.xml');
                        //xmlTextElement.innerHTML = load('/src/data/examples/AcetylPrior/AcetylPrior.xml');
                        xmlTextElement.innerHTML = load(file.name);
                    }
                }
                */
                /*
                if (file) {
                    console.log(file.name);
                    if (xmlTextElement) {
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            let contents = e.target.result as string;
                            console.log("contents=" + contents);
                            xmlTextElement.innerHTML = load(contents);
                        };
                        reader.readAsText(file);
                    }
                }
                */
                console.log(file.name);
                input_xml_filename = file.name;
                if (xmlTextElement) {
                    let reader = new FileReader();
                    let chunkSize = 1024 * 1024; // 1MB
                    let start = 0;
                    let contents = '';
                    reader.onload = function (e) {
                        if (!e.target) {
                            throw new Error('Event target is null');
                        }
                        contents += (e.target as FileReader).result as string;
                        if (file != null) {
                            if (start < file.size) {
                                // Read the next chunk
                                let blob = file.slice(start, start + chunkSize);
                                reader.readAsText(blob);
                                start += chunkSize;
                            } else {
                                // All chunks have been read
                                contents = contents.trim();
                                //console.log("contents=" + contents);
                                xmlTextElement.innerHTML = XMLToHTML(contents);
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
        // Make the save button visible.
        let saveButton: HTMLElement | null = document.getElementById('saveButton');
        if (saveButton != null) {
            saveButton.style.display = 'inline';
        }
    }

    /**
     * Save an XML file.
     */
    window.saveXML = function () {
        console.log("saveXML");

        const pad: string = "  ";
        let level: number;
        const padding2: string = pad.repeat(2);

        // Create me.title.
        let title_xml = "\n" + pad + getTag(title, "me:title");

        // Create moleculeList.
        level = 2;
        let moleculeList: string = "";
        molecules.forEach(function (molecule, id) {
            moleculeList += molecule.toXML(pad, level);
        });
        moleculeList = getTag(moleculeList, "moleculeList", undefined, undefined, undefined, pad, true);

        // Create reactionList.
        level = 2;
        let reactionList: string = "\n";
        reactions.forEach(function (reaction, id) {
            reactionList += reaction.toXML(pad, level);
        });
        reactionList = getTag(reactionList, "reactionList", undefined, undefined, undefined, pad, true);

        // Create me.Conditions
        //let conditions: string = "\n";

        // Create modelParameters

        // create me.control

        // Create a new Blob object from the data
        let blob = new Blob([header, mesmerStartTag, title_xml, moleculeList, reactionList, mesmerEndTag],
            { type: "text/plain" });

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

    }

    /**
     * Load a specific XML File
     */
    function load(xmlFile: string): string {
        console.log("xmlFile=" + xmlFile);
        // The following works in the browser environment.
        // To work in a node environment, use JDOM or similar...
        let request = new XMLHttpRequest();
        request.open("GET", xmlFile, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                /*
                // Get response as text and convert to XML
                // Get response as text
                let text=request.responseText;
                console.log("text=" + text);
                // Convert text to XML
                let parser=new DOMParser();
                let xml=parser.parseFromString(text, "text/xml");
                */
                // Get response as XML and convert to string
                let xml: XMLDocument | null = request.responseXML;
                if (xml == null) {
                    throw new Error('XML is null');
                } else {
                    // Convert XML to string
                    let serializer = new XMLSerializer();
                    let text: string = serializer.serializeToString(xml);
                    //console.log("text=" + text);
                    const xmlTextElement = document.getElementById("xml_text");
                    if (xmlTextElement) {
                        xmlTextElement.innerHTML = XMLToHTML(text);
                    }
                    //console.log("xml=" + xml);
                    //parse(text);
                    /**
                     * Check the XML against the XSD.
                     */
                    //let isValid: boolean = validateXML(text, mesmer_xsd, [mesmerPlugins_xsd, CMLforMesmer_xsd]);
                    //console.log("isValid=" + isValid);
                    parse(xml);
                    console.log("text=" + text);
                    return text;
                }
            } else {
                console.log("request.readyState=" + request.readyState);
                console.log("request.status=" + request.status);
                throw new Error('Failed to load XML file');
            }
        };
        request.send();
        /*
        fetch(xmlFile)
          .then(response=> response.text())
          .then(text=> {
            console.log("text=" + text);
            document.getElementById("xml_text").innerHTML=XMLToHTML(text);
            let parser=new DOMParser();
            let xml=parser.parseFromString(text, "text/xml");
            console.log("xml=" + xml);
            parse(xml);
          }
        );
        */
        /*
        fetch(xmlFile)
          .then(function(response) {
            return response.text();
          }).then(function(text) {
            console.log("text=" + text);
            document.getElementById("xml_text").innerHTML=XMLToHTML(text);
            let parser=new DOMParser();
            let xml=parser.parseFromString(text, "text/xml");
            console.log("xml=" + xml);
            parse(xml);
          }
        );
        */
        throw new Error('Not implemented');
    }

    /**
     * Parse the XML.
     * @param {XMLDocument} xml 
     */
    function parse(xml: XMLDocument) {

        /**
         * Set mesmer_xml start tag.
         */
        mesmerStartTag = "\n";
        let documentElement: HTMLElement = xml.documentElement;
        if (documentElement == null) {
            throw new Error("Document element not found");
        } else {
            let tagName: string = documentElement.tagName;
            mesmerStartTag += "<" + tagName;
            console.log(tagName);
            mesmerEndTag = getEndTag(tagName);
            let first: boolean = true;
            let pad = " ".repeat(tagName.length + 2);
            let names: string[] = documentElement.getAttributeNames();
            names.forEach(function (name) {
                let attribute = documentElement.getAttribute(name);
                let na = `${name}="${attribute}"`;
                if (first) {
                    first = false;
                    mesmerStartTag += " " + na;
                } else {
                    mesmerStartTag += "\n" + pad + na;
                }
            });
            mesmerStartTag += ">";
            //console.log(mesmerStartTag);
        }

        /**
         *  Set h1.
         */
        let me_title: HTMLCollectionOf<Element> = xml.getElementsByTagName('me:title');
        if (me_title == null) {
            throw new Error('me:title not found');
        } else {
            if (me_title.length != 1) {
                throw new Error('Multiple me:title elements found');
            } else {
                title = me_title[0].childNodes[0].nodeValue as string;
                title = title.trim();
                console.log("Title=" + title);
                const element = document.getElementById("h1");
                if (element != null) {
                    element.innerHTML = title;
                }
            }
        }

        /**
         * Generate molecules table.
         */
        initMolecules(xml);
        displayMoleculesTable();

        // Add event listeners to molecules table.
        molecules.forEach(function (molecule, id) {
            let energyKey = id + "_energy";
            let inputElement = document.getElementById(energyKey) as HTMLInputElement;
            if (inputElement) {
                inputElement.addEventListener('change', (event) => {
                    // The input is set up to call the function setEnergy(HTMLInputElement),
                    // so the following commented code is not used. As the input was setup 
                    // as a number type. The any non numbers were It seems that there are two 
                    // ways to get and store the value of the input element.
                    // Both ways have been kept for now as I don't know which way is better!
                    let eventTarget = event.target as HTMLInputElement;
                    let inputValue = eventTarget.value;
                    if (isNumeric(inputValue)) {
                        molecule.setEnergy(parseFloat(inputValue));
                        console.log("Set energy of " + id + " to " + inputValue + " kJ/mol");
                    } else {
                        alert("Energy input for " + id + " is not a number");
                        let inputElement = document.getElementById(energyKey) as HTMLInputElement;
                        inputElement.value = molecule.getEnergy().toString();
                        console.log("inputValue=" + inputValue);
                        console.log("Type of inputValue: " + typeof inputValue);
                    }
                });
            }
        });

        /**
         * Generate reactions table.
         */
        initReactions(xml);
        displayReactionsTable();

        /**
         * Generate reactions diagram.
         */
        if (reactions.size > 1) {
            // Set the heading.
            const element = document.getElementById("reactions_diagram_title");
            if (element != null) {
                element.innerHTML = "Diagram";
            }
            // Display the diagram.
            let canvas: HTMLCanvasElement | null = document.getElementById("reactions_diagram") as HTMLCanvasElement;
            let font: string = "14px Arial";
            let dark: boolean = true;
            let lw: number = 4;
            let lwc: number = 2;
            if (canvas != null) {
                canvas.style.display = "block";
                drawReactionDiagram(canvas, molecules, reactions, dark, font, lw, lwc);
            }
        }

        /**
         * Generate conditions table.
         */
        //initConditions(xml);

        /**
         * Generate parameters table.
         */
        //initModelParameters(xml);

        /**
         * Generate control table.
         */
        //initControl(xml);
    }

    /**
     * Parses xml to initilise molecules.
     * @param {XMLDocument} xml The XML document.
     */
    function initMolecules(xml: XMLDocument): void {
        console.log("initMolecules");
        // The xml should have one moleculeList element. Molecules are referred to in the reactionsList, 
        // but reactions do not have a moleculeList element.
        let xml_moleculeList: HTMLCollectionOf<Element> = xml.getElementsByTagName('moleculeList');
        if (xml_moleculeList.length != 1) {
            //return;
            throw new Error("Expecting 1 moleculeList but finding " + xml_moleculeList.length);
        }
        // Set the heading.
        const element = document.getElementById("molecules_title");
        if (element != null) {
            element.innerHTML = "Molecules";
        }
        // The moleculeList element should have one or more molecule elements and no other elements.
        let moleculeListTagNames: Set<string> = new Set();
        xml_moleculeList[0].childNodes.forEach(function (node) {
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
        let xml_molecules: HTMLCollectionOf<Element> = xml_moleculeList[0].getElementsByTagName('molecule');
        let xml_molecules_length = xml_molecules.length;
        console.log("Number of molecules=" + xml_molecules_length);
        // Process each molecule.
        //xml_molecules.forEach(function (xml_molecule) { // For some reason this does not work.
        for (let i = 0; i < xml_molecules.length; i++) {
            // Set attributes.
            let attributes: Map<string, string> = getAttributes(xml_molecules[i]);

            let moleculeTagNames: Set<string> = new Set();
            let cns: NodeListOf<ChildNode> = xml_molecules[i].childNodes;
            cns.forEach(function (node) {
                moleculeTagNames.add(node.nodeName);
            });
            //console.log("moleculeTagNames:");
            //moleculeTagNames.forEach(x => console.log(x));

            // Set atoms.
            const atoms: Map<string, Atom> = new Map();
            // Sometimes there is an individual atom not in an atomArray.
            //let xml_atomArray = xml_molecules[i].getElementsByTagName("atomArray")[0];
            //if (xml_atomArray != null) {
            moleculeTagNames.delete("atom");
            moleculeTagNames.delete("atomArray");

            let xml_atoms: HTMLCollectionOf<Element> = xml_molecules[i].getElementsByTagName("atom");
            for (let j = 0; j < xml_atoms.length; j++) {
                let attribs: Map<string, string> = getAttributes(xml_atoms[j]);
                let id: string | undefined = attribs.get("id");
                if (id != undefined) {
                    let atom = new Atom(attribs);
                    //console.log(atom.toString());
                    atoms.set(id, atom);
                }
            }
            //}
            // Read bondArray.
            moleculeTagNames.delete("bond");
            moleculeTagNames.delete("bondArray");
            const bonds: Map<string, Bond> = new Map();
            let xml_bonds: HTMLCollectionOf<Element> = xml_molecules[i].getElementsByTagName("bond");
            for (let j = 0; j < xml_bonds.length; j++) {
                let attribs: Map<string, string> = getAttributes(xml_bonds[j]);
                let id: string | undefined = attribs.get("atomRefs2");
                if (id != undefined) {
                    let bond = new Bond(attribs);
                    //console.log(bond.toString());
                    bonds.set(id, bond);
                }
            }
            // Read propertyList.
            const properties: Map<string, Property> = new Map();
            // Sometimes there is a single property not in propertyList!
            //let xml_propertyList = xml_molecules[i].getElementsByTagName("propertyList")[0];
            //if (xml_propertyList != null) {
            //    let xml_properties = xml_propertyList.getElementsByTagName("property");

            moleculeTagNames.delete("property");
            moleculeTagNames.delete("propertyList");
            let xml_properties: HTMLCollectionOf<Element> = xml_molecules[i].getElementsByTagName("property");
            for (let j = 0; j < xml_properties.length; j++) {
                let attribs: Map<string, string> = getAttributes(xml_properties[j]);
                let children: HTMLCollectionOf<Element> = xml_properties[j].children;
                if (children.length != 1) {
                    throw new Error("Expecting 1 child but finding " + children.length);
                }
                let nodeAttributes: Map<string, string> = getAttributes(children[0]);
                let nodeName: string = children[0].nodeName; // Expecting scalar or array
                let textContent: string | null = children[0].textContent;
                if (textContent == null) {
                    console.error("nodeName");
                    throw new Error('textContent is null');
                }
                textContent = textContent.trim();
                let dictRef: string | undefined = attribs.get("dictRef");
                //console.log("dictRef=" + dictRef);
                if (dictRef == null) {
                    throw new Error('dictRef is null');
                }
                //console.log("fcnn=" + fcnn);
                if (nodeName == "scalar") {
                    moleculeTagNames.delete("scalar");
                    let value: number = parseFloat(textContent);
                    properties.set(dictRef, new Property(attribs,
                        new NumberWithAttributes(nodeAttributes, value)));
                    if (dictRef === "me:ZPE") {
                        minMoleculeEnergy = Math.min(minMoleculeEnergy, value);
                        maxMoleculeEnergy = Math.max(maxMoleculeEnergy, value);
                    }
                } else if (nodeName == "array") {
                    moleculeTagNames.delete("array");
                    properties.set(dictRef, new Property(attribs,
                        new NumberArrayWithAttributes(nodeAttributes,
                            toNumberArray(textContent.split(/\s+/)), " ")));
                } else {
                    throw new Error("Unexpected nodeName: " + nodeName);
                }
            }

            let els: HTMLCollectionOf<Element> | null;

            // Read energyTransferModel
            moleculeTagNames.delete("me:energyTransferModel");
            let energyTransferModel: EnergyTransferModel | undefined = undefined;
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
                        let value: number = parseFloat(getNodeValue(getFirstChildNode(xml_deltaEDown[0])));
                        let deltaEDown: DeltaEDown = new DeltaEDown(getAttributes(xml_deltaEDown[0]), value);
                        energyTransferModel = new EnergyTransferModel(getAttributes(els[0]), deltaEDown);
                    }
                }
            }

            // Read DOSCMethod
            moleculeTagNames.delete("me:DOSCMethod");
            let dOSCMethod: DOSCMethod | undefined = undefined;
            els = xml_molecules[i].getElementsByTagName("me:DOSCMethod");
            if (els != null) {
                let el: Element | null = els[0];
                if (el != null) {
                    if (el != null) {
                        let type = el.getAttribute("xsi:type");
                        if (type != null) {
                            dOSCMethod = new DOSCMethod(type);
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

            let molecule = new Molecule(attributes, atoms, bonds, properties, energyTransferModel, dOSCMethod);
            //console.log(molecule.toString());
            molecules.set(molecule.id, molecule);
        }
    }

    /**
     * Parses xml to initialise reactions.
     * @param {XMLDocument} xml The XML document.
     */
    function initReactions(xml: XMLDocument): void {
        console.log("initReactions");
        let xml_reactions: HTMLCollectionOf<Element> = xml.getElementsByTagName('reactionList')[0].getElementsByTagName('reaction');
        let xml_reactions_length = xml_reactions.length;
        console.log("Number of reactions=" + xml_reactions_length);
        // Process each reaction.
        if (xml_reactions_length == 0) {
            //return;
            throw new Error("Expecting 1 reactionsList but finding " + xml_reactions_length);
        }
        // Set the heading.
        const element = document.getElementById("reactions_title");
        if (element != null) {
            element.innerHTML = "Reactions";
        }
        for (let i = 0; i < xml_reactions_length; i++) {
            let attributes: Map<string, string> = getAttributes(xml_reactions[i]);
            let reactionID = attributes.get("id");
            if (reactionID == null) {
                throw new Error("reactionID is null");
            }
            let xml_active = attributes.get("active");
            let active: boolean = true;
            if (xml_active != null) {
                if (xml_active === "false") {
                    active = false;
                }
            }
            if (reactionID != null) {
                console.log("id=" + reactionID);
                // Load reactants.
                let reactants: Map<string, Reactant> = new Map([]);
                let xml_reactants = xml_reactions[i].getElementsByTagName('reactant');
                //console.log("xml_reactants.length=" + xml_reactants.length);
                for (let j = 0; j < xml_reactants.length; j++) {
                    let xml_molecule: Element = getFirstElement(xml_reactants[j], 'molecule');
                    let moleculeID: string = getAttribute(xml_molecule, "ref");
                    let reactant: Reactant = new Reactant(getAttributes(xml_reactants[j]),
                        get(molecules, moleculeID));
                    reactants.set(moleculeID, reactant);
                }
                // Load products.
                let products: Map<string, Product> = new Map([]);
                let xml_products: HTMLCollectionOf<Element> = xml_reactions[i].getElementsByTagName('product');
                //console.log("xml_products.length=" + xml_products.length);
                for (let j = 0; j < xml_products.length; j++) {
                    let xml_molecule = getFirstElement(xml_products[j], 'molecule');
                    let moleculeID: string = getAttribute(xml_molecule, "ref");
                    products.set(moleculeID,
                        new Product(getAttributes(xml_products[j]),
                            get(molecules, moleculeID)));
                }
                // Load MCRCMethod.
                //console.log("Load MCRCMethod...");
                let mCRCMethod: MCRCMethod | undefined;
                let xml_MCRCMethod: HTMLCollectionOf<Element> = xml_reactions[i].getElementsByTagName('me:MCRCMethod');
                //console.log("xml_MCRCMethod=" + xml_MCRCMethod);
                //console.log("xml_MCRCMethod.length=" + xml_MCRCMethod.length);
                if (xml_MCRCMethod.length > 0) {
                    let attributes: Map<string, string> = getAttributes(xml_MCRCMethod[0]);
                    let name: string | undefined = attributes.get("name");
                    if (name == null) {
                        let type = attributes.get("xsi:type");
                        if (type != null) {
                            if (type === "me:MesmerILT") {
                                let preExponential: PreExponential | undefined;
                                let xml_preExponential = xml_MCRCMethod[0].getElementsByTagName("me:preExponential");
                                if (xml_preExponential != null) {
                                    if (xml_preExponential[0] != null) {
                                        let value: number = parseFloat(getNodeValue(getFirstChildNode(xml_preExponential[0])));
                                        preExponential = new PreExponential(getAttributes(xml_preExponential[0]), value);
                                    }
                                }
                                let activationEnergy: ActivationEnergy | undefined;
                                let xml_activationEnergy = xml_MCRCMethod[0].getElementsByTagName("me:activationEnergy");
                                if (xml_activationEnergy != null) {
                                    if (xml_activationEnergy[0] != null) {
                                        let value: number = parseFloat(getNodeValue(getFirstChildNode(xml_activationEnergy[0])));
                                        activationEnergy = new ActivationEnergy(getAttributes(xml_activationEnergy[0]), value);
                                    }
                                }
                                let tInfinity: number | undefined;
                                let xml_tInfinity = xml_MCRCMethod[0].getElementsByTagName("me:TInfinity");
                                if (xml_tInfinity != null) {
                                    if (xml_tInfinity[0] != null) {
                                        let cns: NodeListOf<ChildNode> = xml_tInfinity[0].childNodes;
                                        let nv: string | null = cns[0].nodeValue;
                                        if (nv != null) {
                                            tInfinity = parseFloat(nv);
                                        }
                                    }
                                }
                                let nInfinity: NInfinity | undefined;
                                let xml_nInfinity = xml_MCRCMethod[0].getElementsByTagName("me:nInfinity");
                                if (xml_nInfinity != null) {
                                    if (xml_nInfinity[0] != null) {
                                        let value: number = parseFloat(getNodeValue(getFirstChildNode(xml_nInfinity[0])));
                                        nInfinity = new NInfinity(getAttributes(xml_nInfinity[0]), value);
                                    }
                                }
                                mCRCMethod = new MesmerILT(attributes, preExponential, activationEnergy, tInfinity, nInfinity);
                            }
                        }
                    } else {
                        mCRCMethod = new MCRCMethod(attributes, name);
                    }
                }
                // Load transition state.
                //console.log("Load  transition state...");
                let xml_transitionState: HTMLCollectionOf<Element> = xml_reactions[i].getElementsByTagName(
                    'me:transitionState');
                let transitionState: TransitionState | undefined;
                if (xml_transitionState.length > 0) {
                    let xml_molecule: Element = xml_transitionState[0].getElementsByTagName('molecule')[0];
                    let moleculeID: string | null = xml_molecule.getAttribute("ref");
                    transitionState = new TransitionState(getAttributes(xml_molecule), get(molecules, moleculeID));
                    console.log("transitionState moleculeID=" + transitionState.molecule.getID());
                    console.log("transitionState role=" + transitionState.attributes.get("role"));
                }
                // Load tunneling.
                let xml_tunneling = xml_reactions[i].getElementsByTagName('me:tunneling');
                let tunneling: Tunneling | undefined;
                if (xml_tunneling.length > 0) {
                    tunneling = new Tunneling(getAttribute(xml_tunneling[0], "name"));
                }
                let reaction = new Reaction(attributes, reactionID, reactants, products,
                    mCRCMethod, transitionState, tunneling);
                reactions.set(reactionID, reaction);
                //console.log("reaction=" + reaction);
            }
        }
    }

    /**
     * Convert XML to HTML.
     * @param {string} text The XML text.
     * @returns {string} The HTML text.
     */
    function XMLToHTML(text: string): string {
        return text.replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>")
            .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
            .replace(/  /g, "&nbsp;&nbsp;");
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
    function drawReactionDiagram(canvas: HTMLCanvasElement, molecules: Map<string, Molecule>,
        reactions: Map<string, Reaction>, dark: boolean, font: string, lw: number, lwc: number): void {
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
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
        //ctx.fillStyle = background;

        // Get text height for font size.
        let th = getTextHeight(ctx, "Aj", font);
        //console.log("th=" + th);

        // Go through reactions:
        // 1. Create sets of reactants, end products, intermediate products and transition states.
        // 2. Create maps of orders and energies.
        // 3. Calculate maximum energy.
        let reactants: Set<string> = new Set();
        let products: Set<string> = new Set();
        let intProducts: Set<string> = new Set();
        let transitionStates: Set<string> = new Set();
        let orders: Map<string, number> = new Map();
        let energies: Map<string, number> = new Map();
        let i: number = 0;
        let energyMin: number = Number.MAX_VALUE;
        let energyMax: number = Number.MIN_VALUE;
        reactions.forEach(function (reaction, id) {
            // Get TransitionState if there is one.
            let transitionState: TransitionState | undefined = reaction.transitionState;
            //console.log("reactant=" + reactant);
            let reactantsLabel: string = reaction.getReactantsLabel();
            reactants.add(reactantsLabel);
            if (products.has(reactantsLabel)) {
                intProducts.add(reactantsLabel);
            }
            let energy: number = reaction.getReactantsEnergy();
            energyMin = Math.min(energyMin, energy);
            energyMax = Math.max(energyMax, energy);
            energies.set(reactantsLabel, energy);
            let productsLabel: string = reaction.getProductsLabel();
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
                let j: number = get(orders, productsLabel);
                // Move product to end and shift everything back.
                orders.forEach(function (value, key) {
                    if (value > j) {
                        orders.set(key, value - 1);
                    }
                });
                // Insert transition state.
                if (transitionState != undefined) {
                    let tsn: string = transitionState.getName();
                    transitionStates.add(tsn);
                    orders.set(tsn, i);
                    energy = transitionState.molecule.getEnergy();
                    energyMin = Math.min(energyMin, energy);
                    energyMax = Math.max(energyMax, energy);
                    energies.set(tsn, energy);
                    i++;
                }
                orders.set(productsLabel, i);
                i++
            } else {
                if (transitionState != undefined) {
                    let tsn: string = transitionState.getName();
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
        let energyRange: number = energyMax - energyMin;
        //console.log("energyRange=" + energyRange);
        //console.log("reactants=" + reactants);
        //console.log("products=" + products);
        //console.log("transitionStates=" + transitionStates);

        // Create a lookup from order to label.
        let reorders: string[] = [];
        orders.forEach(function (value, key) {
            reorders[value] = key;
        });
        //console.log("reorders=" + arrayToString(reorders));

        // Iterate through the reorders:
        // 1. Capture coordinates for connecting lines.
        // 2. Store maximum x.
        let x0: number = 0;
        let y0: number;
        let x1: number;
        let y1: number;
        let xmax: number = 0;
        let tw: number;
        let textSpacing: number = 5; // Spacing between end of line and start of text.
        let stepSpacing: number = 10; // Spacing between steps.
        let reactantsInXY: Map<string, number[]> = new Map();
        let reactantsOutXY: Map<string, number[]> = new Map();
        let productsInXY: Map<string, number[]> = new Map();
        let productsOutXY: Map<string, number[]> = new Map();
        let transitionStatesInXY: Map<string, number[]> = new Map();
        let transitionStatesOutXY: Map<string, number[]> = new Map();
        reorders.forEach(function (value) {
            //console.log("value=" + value + ".");
            //console.log("energies=" + mapToString(energies));
            let energy: number = get(energies, value);
            let energyRescaled: number = rescale(energyMin, energyRange, 0, canvas.height, energy);
            // Get text width.
            tw = Math.max(getTextWidth(ctx, energy.toString(), font), getTextWidth(ctx, value, font));
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
        ctx.transform(1, 0, 0, -1, 0, canvasHeightWithBorder)


        // Go through reactions and draw connecting lines.
        reactions.forEach(function (reaction, id) {
            //console.log("id=" + id);
            //console.log("reaction=" + reaction);
            // Get TransitionState if there is one.
            let transitionState: TransitionState | undefined = reaction.transitionState;
            //console.log("reactant=" + reactant);
            let reactantsLabel: string = reaction.getReactantsLabel();
            let productsLabel: string = reaction.getProductsLabel();
            let reactantOutXY: number[] = get(reactantsOutXY, reactantsLabel);
            let productInXY: number[] = get(productsInXY, productsLabel);
            if (transitionState != undefined) {
                let transitionStateLabel: string = transitionState.getName();
                let transitionStateInXY: number[] = get(transitionStatesInXY, transitionStateLabel);
                drawLine(ctx, black, lwc, reactantOutXY[0], reactantOutXY[1], transitionStateInXY[0],
                    transitionStateInXY[1]);
                let transitionStateOutXY: number[] = get(transitionStatesOutXY, transitionStateLabel);
                drawLine(ctx, black, lwc, transitionStateOutXY[0], transitionStateOutXY[1],
                    productInXY[0], productInXY[1]);
            } else {
                drawLine(ctx, black, lwc, reactantOutXY[0], reactantOutXY[1],
                    productInXY[0], productInXY[1]);
            }
        });

        // Draw horizontal lines and labels.
        // (This is done last so that the labels are on top of the vertical lines.)
        reactants.forEach(function (value) {
            let energy: number = get(energies, value);
            let energyRescaled: number = rescale(energyMin, energyRange, 0, originalCanvasHeight, energy);
            let x0: number = get(reactantsInXY, value)[0];
            let y: number = energyRescaled + lw;
            let x1: number = get(reactantsOutXY, value)[0];
            let energyString: string = energy.toString();
            drawLevel(ctx, blue, lw, x0, y, x1, y, font, th, value, energyString);
        });
        products.forEach(function (value) {
            let energy: number = get(energies, value);
            let energyRescaled: number = rescale(energyMin, energyRange, 0, originalCanvasHeight, energy);
            let x0: number = get(productsInXY, value)[0];
            let y: number = energyRescaled + lw;
            let x1: number = get(productsOutXY, value)[0];
            let energyString: string = energy.toString();
            if (intProducts.has(value)) {
                drawLevel(ctx, orange, lw, x0, y, x1, y, font, th, value, energyString);
            } else {
                drawLevel(ctx, green, lw, x0, y, x1, y, font, th, value, energyString);
            }
        });
        transitionStates.forEach(function (value) {
            let v: any;
            let energy: number = get(energies, value);
            let energyRescaled: number = rescale(energyMin, energyRange, 0, originalCanvasHeight, energy);
            let x0: number = get(transitionStatesInXY, value)[0];
            let y: number = energyRescaled + lw;
            let x1: number = get(transitionStatesOutXY, value)[0];
            let energyString: string = energy.toString();
            drawLevel(ctx, red, lw, x0, y, x1, y, font, th, value, energyString);
        });
    }
});

function displayMoleculesTable() {
    if (molecules.size == 0) {
        return;
    }
    // Prepare table headings.
    let moleculesTable = getTH([
        "Name",
        "Energy<br>kJ/mol",
        "Rotation constants<br>cm<sup>-1</sup>",
        "Vibration frequencies<br>cm<sup>-1</sup>"]);
    molecules.forEach(function (molecule, id) {
        //console.log("id=" + id);
        //console.log("molecule=" + molecule);
        let energyNumber: number = molecule.getEnergy();
        let energy: string;
        if (energyNumber == null) {
            energy = "";
        } else {
            energy = energyNumber.toString();
        }
        //console.log("energy=" + energy);
        let rotationConstants: string = "";
        let rotConsts: number[] | undefined = molecule.getRotationConstants();
        if (rotConsts != undefined) {
            rotationConstants = arrayToString(rotConsts, " ");
        }
        let vibrationFrequencies: string = "";
        let vibFreqs: number[] | undefined = molecule.getVibrationFrequencies();
        if (vibFreqs != undefined) {
            vibrationFrequencies = arrayToString(vibFreqs, " ");
        }
        moleculesTable += getTR(getTD(id)
            + getTD(getInput("number", id + "_energy", "setEnergy(this)", energy))
            + getTD(rotationConstants, true)
            + getTD(vibrationFrequencies, true));
    });
    const moleculesElement = document.getElementById("molecules_table");
    if (moleculesElement !== null) {
        moleculesElement.innerHTML = moleculesTable;
    }
}

function displayReactionsTable() {
    if (reactions.size == 0) {
        return;
    }
    // Prepare table headings.
    let reactionsTable = getTH(["ID", "Reactants", "Products", "Transition State",
        "PreExponential", "Activation Energy", "TInfinity", "NInfinity"]);
    reactions.forEach(function (reaction, id) {
        //console.log("id=" + id);
        //console.log("reaction=" + reaction);
        let reactants: string = arrayToString(Array.from(reaction.reactants.keys()), " ");
        let products: string = arrayToString(Array.from(reaction.products.keys()), " ");
        let transitionState: string = "";
        let preExponential: string = "";
        let activationEnergy: string = "";
        let tInfinity: string = "";
        let nInfinity: string = "";
        if (reaction.transitionState != undefined) {
            transitionState = reaction.transitionState.getName();
        }
        if (reaction.mCRCMethod != undefined) {
            if (reaction.mCRCMethod instanceof MesmerILT) {
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
            } else {
                if (reaction.mCRCMethod.attributes.get("name") == "RRKM") {
                } else {
                    throw new Error("Unexpected mCRCMethod: " + reaction.mCRCMethod);
                }
            }
        }
        reactionsTable += getTR(getTD(id) + getTD(reactants) + getTD(products) + getTD(transitionState)
            + getTD(preExponential, true) + getTD(activationEnergy, true) + getTD(tInfinity, true)
            + getTD(nInfinity, true));
        const reactionsElement = document.getElementById("reactions_table");
        if (reactionsElement !== null) {
            reactionsElement.innerHTML = reactionsTable;
        }
    });
}

/**
 * Set the energy of a molecule when the energy input value is changed.
 * @param input The input element. 
 */
export function setEnergy(input: HTMLInputElement): void {
    let id_energy: string = input.id;
    let moleculeID: string = id_energy.split("_")[0];
    let molecule: Molecule | undefined = molecules.get(moleculeID);
    if (molecule != undefined) {
        console.log("Type of inputValue: " + typeof input.value);
        let inputValue: number = parseFloat(input.value);
        if (!isNaN(inputValue)) {
            molecule.setEnergy(inputValue);
        } else {
            alert("Energy input for " + moleculeID + " is not a number");
            let inputElement = document.getElementById(id_energy) as HTMLInputElement;
            inputElement.value = molecule.getEnergy().toString();
        }
        //console.log("molecule=" + molecule);
    }
    //console.log("id_energy=" + id_energy);
    //console.log("moleculeID=" + moleculeID);
}

(window as any).setEnergy = setEnergy;