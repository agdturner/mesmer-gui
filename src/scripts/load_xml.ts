import {
    Atom,
    Bond,
    PropertyScalar,
    PropertyArray,
    Molecule,
    Reactant,
    Product,
    TransitionState,
    MCRCType,
    PreExponential,
    ActivationEnergy,
    NInfinity,
    MesmerILT,
    MCRCMethod,
    ZhuNakamuraCrossing,
    SumOfStates,
    SumOfStatesPoint,
    DefinedSumOfStates,
    Reaction,
    ReactionWithTransitionState,
    PTpair,
    Conditions,
    GrainSize,
    ModelParameters,
    DiagramEnergyOffset,
    Control
} from './classes.js';

import {
    arrayToString,
    mapToString
} from './functions.js';

//import {JSDOM} from 'jsdom'; // Can't use JSDOM in a browser.

/**
 * A map of molecules with Molecule.id as key and Molecules as values.
 */
const molecules = new Map<string, Molecule>([]);

/**
 * For storing the maximum molecule energy in a reaction.
 */
var maxMoleculeEnergy = -Infinity;

/**
 * For storing the minimum molecule energy in a reaction.
 */
var minMoleculeEnergy = Infinity;

/**
 * A map of reactions with Reaction.id as keys and Reactions as values.
 */
const reactions = new Map<string, Reaction>([]);

const xmlTextElement = document.getElementById("xml_text");
if (xmlTextElement) {
    xmlTextElement.innerHTML = load('/src/data/examples/AcetylO2/Acetyl_O2_associationEx.xml');
}

/**
 * Load a specific XML File
 */
function load(xmlFile: string): string {
    console.log("xmlFile=" + xmlFile);
    let xml: XMLDocument;
    let text: string;
    // This works in the browser enviornment, but not in a node enviornment where somehting like JDOM is wanted.
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
            xml = request.responseXML;
            if (xml != null) {
                // Convert XML to string
                let serializer = new XMLSerializer();
                text = serializer.serializeToString(xml);
                console.log("text=" + text);
                const xmlTextElement = document.getElementById("xml_text");
                if (xmlTextElement) {
                    xmlTextElement.innerHTML = XMLToHTML(text);
                }
                //console.log("xml=" + xml);
                //parse(text);
                parseXML(xml);
            }
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
    return text;
}

/**
 * Parse the XML.
 * @param {XMLDocument} xml 
 */
function parseXML(xml: XMLDocument) {
    /**
     * Log to console and display me.title.
     * This goes through the entire XML file and writes out log messages to the consol.
     */
    let elements = xml.getElementsByTagName('*');
    console.log("Number of elements=" + elements.length);
    for (let i = 0; i < elements.length; i++) {
        let nn = elements[i].nodeName;
        //let tn=elements[i].tagName;
        //let nn=elements[i].getNodeName();
        if (nn != null) {
            //console.log("elements[" + i + "].nodeName=" + nn);
            //console.log("elements[" + i + "].tagName=" + nn);
            let cn = elements[i].childNodes[0];
            if (cn != null) {
                let nv = cn.nodeValue;
                if (nv != null) {
                    nv = nv.trim();
                    if (nv.length > 0) {
                        if (nn === "me:title") {
                            const element = document.getElementById("metitle");
                            if (element !== null) {
                                element.innerHTML = nv;
                            }
                        }
                        //console.log("elements[" + i + "].childNodes[0].nodeValue=" + nv);
                    }
                }
            }
        }
    }
    // The following does not work because of the ":" in the tag.
    //var title=xmlDoc.getElementsByTagName('me:title').nodeValue;
    //console.log("Title=" + title);
    //document.getElementById("metitle").innerHTML=title;

    /**
     * Generate molecules table.
     */
    let molecules: Map<string, Molecule> = getMolecules(xml);
    // Prepare table headings.
    const names = ["Name", "Energy<br>kJ/mol", "Rotational constants<br>cm<sup>-1</sup>", "Vibrational frequencies<br>cm<sup>-1</sup>"];
    let table = getTH(names);
    molecules.forEach(function (molecule, id) {
        console.log("id=" + id);
        console.log("molecule=" + molecule);
        let energyNumber: number = molecule.getEnergy();
        let energy: string;
        if (energyNumber == null) {
            energy = "";
        } else {
            energy = molecule.getEnergy().toString();
        }
        let rotationConstants: string = arrayToString(molecule.getRotationConstants());
        let vibrationFrequencies: string = arrayToString(molecule.getVibrationFrequencies());
        table += getTR(getTD(id) + getTD(energy) + getTD(rotationConstants) + getTD(vibrationFrequencies));
    });
    const moleculesElement = document.getElementById("molecules");
    if (moleculesElement !== null) {
        moleculesElement.innerHTML = table;
    }

    /**
     * Generate reactions table.
     */
    /*
    const reactionsElement=document.getElementById("reactions");
    if (reactionsElement !==null) {
        reactionsElement.innerHTML=getTable(parseReactions(xml));
    }
    */

    /**
     * Generate reactions well diagram.
     */
    /*
    const diagramElement=document.getElementById("diagram");
    if (diagramElement !==null) {
        diagramElement.innerHTML=createDiagram();
    }
    */
}

/**
 * Parse the XML.
 * @param {string} text 
 */
function parse(text: string) {
    /**
     * Log to console and display me.title.
     * This goes through the entire XML file and writes out log messages to the consol.
     */
    //const dom=new JSDOM(text);
    let elements;//=xml.getElementsByTagName('*');
    console.log("Number of elements=" + elements.length);
    for (let i = 0; i < elements.length; i++) {
        let nn = elements[i].nodeName;
        //let tn=elements[i].tagName;
        //let nn=elements[i].getNodeName();
        if (nn != null) {
            //console.log("elements[" + i + "].nodeName=" + nn);
            //console.log("elements[" + i + "].tagName=" + nn);
            let cn = elements[i].childNodes[0];
            if (cn != null) {
                let nv = cn.nodeValue;
                if (nv != null) {
                    nv = nv.trim();
                    if (nv.length > 0) {
                        if (nn === "me:title") {
                            const element = document.getElementById("metitle");
                            if (element !== null) {
                                element.innerHTML = nv;
                            }
                        }
                        //console.log("elements[" + i + "].childNodes[0].nodeValue=" + nv);
                    }
                }
            }
        }
    }
    // The following does not work because of the ":" in the tag.
    //var title=xmlDoc.getElementsByTagName('me:title').nodeValue;
    //console.log("Title=" + title);
    //document.getElementById("metitle").innerHTML=title;

    /**
     * Generate molecules table.
     */
    const moleculesElement = document.getElementById("molecules");
    if (moleculesElement !== null) {
        //moleculesElement.innerHTML=getTable(parseMolecules(text));
    }

    /**
     * Generate reactions table.
     */
    /*
    const reactionsElement=document.getElementById("reactions");
    if (reactionsElement !==null) {
        reactionsElement.innerHTML=getTable(parseReactions(xml));
    }
    */

    /**
     * Generate reactions well diagram.
     */
    /*
    const diagramElement=document.getElementById("diagram");
    if (diagramElement !==null) {
        diagramElement.innerHTML=createDiagram();
    }
    */
}

/**
 * Generate reactions table.
 * Initialise the reactionsInformation Map.
 * @param XMLDocument xml
 * @returns String
function parseReactions(xml: XMLDocument) {
    let xml_reactions=xml.getElementsByTagName("reaction");
    let xml_reactions_length=xml_reactions.length;
    console.log("Number of xml reaction elements=" + xml_reactions_length);
    // Report number of reactions with id attributes.
    console.log("Number of xml reaction elements with ids=" + count(xml_reactions, "id"));
    // Prepare table headings.
    let names=["ID", "Reactants", "Products", "Transition State", "PreExponential", "Activation Energy", 
    "TInfinity", "NInfinity"];
    var table=getTH(names);
    // Process each reaction.
    for (let i=0; i < xml_reactions_length; i++) {
        let id=xml_reactions[i].getAttribute("id");
        var treactants="";
        var tproducts="";
        var ttransitionState="";
        var tpreExponential="";
        var tactivationEnergy="";
        var ttInfinity="";
        var tnInfinity="";
        if (id !=null) {
            //console.log("id=" + id);
            let reactionMap=new Map([]);
            let reactants=new Set<String>([]);
            let products=new Set<String>([]);
            let elements=reactions[i].getElementsByTagName("*");
            //console.log("elements.length=" + elements.length);
            for (let j=0; j < elements.length; j++) {
                //console.log("elements[" + j + "]=" + elements[j]);
                //console.log("elements[" + j + "].length=" + elements[j].length);
                //console.log("elements[" + j + "].nodeName=" + elements[j].nodeName);
                //console.log("elements[" + j + "].nodeValue=" + elements[j].nodeValue);
                if (elements[j].nodeName==="reactant") {
                    let molecules=elements[j].getElementsByTagName("molecule");
                    //console.log("molecules=" + molecules);
                    //console.log("molecules.length=" + molecules.length);
                    //if (molecules.length > 0) {
                    let moleculeRef=molecules[0].getAttribute("ref");
                    //console.log("moleculeRef=" + moleculeRef);
                    let moleculeRole=molecules[0].getAttribute("role");
                    //console.log("moleculeRole=" + moleculeRole);
                    if (treactants==="") {
                        treactants +=moleculeRef;
                    } else {
                        treactants +=" + " + moleculeRef;
                    }
                    reactants.add(moleculeRef);
                    //}
                } else if (elements[j].nodeName==="product") {
                    let molecules=elements[j].getElementsByTagName("molecule");
                    //console.log("molecules=" + molecules);
                    //console.log("molecules.length=" + molecules.length);
                    if (molecules.length > 0) {
                        let moleculeRef=molecules[0].getAttribute("ref");
                        //console.log("moleculeRef=" + moleculeRef);
                        var moleculeRole=molecules[0].getAttribute("role");
                        //console.log("moleculeRole=" + moleculeRole);
                        if (tproducts==="") {
                            tproducts +=moleculeRef;
                        } else {
                            //console.log("tproducts=" + tproducts);
                            tproducts +=" + " + moleculeRef;
                            //console.log("tproducts=" + tproducts);
                        }
                        products.add(moleculeRef);
                    }
                } else if (elements[j].nodeName==="me:MCRCMethod") {
                    //console.log("MCRCMethod");
                    //console.log("elements[j].getAttribute(\"xsi:type\")=" + elements[j].getAttribute("xsi:type"));
                    let els=elements[j].getElementsByTagName("*");
                    //console.log("els=" + els);
                    //console.log("els.length=" + els.length);
                    if (els.length > 0) {
                        for (let k=0; k < els.length; k++) {
                            //var moleculeRef=molecules[0].getAttribute("ref");
                            //console.log("els[" + k + "]=" + els[k]);
                            //console.log("els[" + k + "].nodeName=" + els[k].nodeName);
                            //console.log("els[" + k + "].nodeValue=" + els[k].nodeValue);
                            if (els[k].nodeName==="me:preExponential") {
                                let cn=els[k].childNodes;
                                //console.log("cn=" + cn);
                                //console.log("cn.length=" + cn.length);
                                //console.log("cn[0].nodeValue=" + cn[0].nodeValue);
                                if (tpreExponential==="") {
                                    tpreExponential +=cn[0].nodeValue;
                                } else {
                                    tpreExponential +=" + " + cn[0].nodeValue;
                                }
                            } else if (els[k].nodeName==="me:activationEnergy") {
                                let cn=els[k].childNodes;
                                //console.log("cn=" + cn);
                                //console.log("cn.length=" + cn.length);
                                //console.log("cn[0].nodeValue=" + cn[0].nodeValue);
                                if (tactivationEnergy==="") {
                                    tactivationEnergy +=cn[0].nodeValue;
                                } else {
                                    tactivationEnergy +=" + " + cn[0].nodeValue;
                                }
                            } else if (els[k].nodeName==="me:TInfinity") {
                                let cn=els[k].childNodes;
                                //console.log("cn=" + cn);
                                //console.log("cn.length=" + cn.length);
                                //console.log("cn[0].nodeValue=" + cn[0].nodeValue);
                                if (ttInfinity==="") {
                                    ttInfinity +=cn[0].nodeValue;
                                } else {
                                    ttInfinity +=" + " + cn[0].nodeValue;
                                }
                            } else if (els[k].nodeName==="me:nInfinity") {
                                let cn=els[k].childNodes;
                                //console.log("cn=" + cn);
                                //console.log("cn.length=" + cn.length);
                                //console.log("cn[0].nodeValue=" + cn[0].nodeValue);
                                if (tnInfinity==="") {
                                    tnInfinity +=cn[0].nodeValue;
                                } else {
                                    tnInfinity +=" + " + cn[0].nodeValue;
                                }
                            } else {
                                //console.log("Unrecognised nodeName=" + els[k].nodeName);
                                return;
                            }
                        }
                    }
                } else if (elements[j].nodeName==="me:transitionState") {
                    let molecules=elements[j].getElementsByTagName("*");
                    //console.log("molecules=" + molecules);
                    //console.log("molecules.length=" + molecules.length);
                    let moleculeRef=molecules[0].getAttribute("ref");
                    //console.log("moleculeRef=" + moleculeRef);
                    let moleculeRole=molecules[0].getAttribute("role");
                    //console.log("moleculeRole=" + moleculeRole);
                    ttransitionState=moleculeRef;
                    transitions.add(ttransitionState);
                    if (reactantToTransitionStates.has(treactants)) {
                        console.log("Adding transition state " + ttransitionState);
                        reactantToTransitionStates.get(treactants).add(ttransitionState);
                    } else {
                        console.log("Adding transition states and transition " + ttransitionState);
                        ts=new Set([]);
                        ts.add(ttransitionState);
                        reactantToTransitionStates.set(treactants, ts);
                    }
                } else {
                    //console.log("elements[" + j + "].nodeName=" + elements[j].nodeName);
                }
            }
            productsToTransitionState.set(tproducts, ttransitionState);
            transitions.add(ttransitionState);
            reactionMap.set("reactants", reactants);
            reactionMap.set("reactantLabel", treactants);
            reactionMap.set("products", products);
            reactionMap.set("productsLabel", tproducts);
            reactionMap.set("transitionState", ttransitionState);
            reactionMap.set("preExponential", tpreExponential);
            reactionMap.set("activationEnergy", tactivationEnergy);
            reactionMap.set("tInfinity", ttInfinity);
            reactionMap.set("nInfinity", tnInfinity);
            reactionsInformation.set(id, reactionMap);
            //console.log("treactants=" + treactants);
            //console.log("tproducts=" + tproducts);
            //console.log("ttransitionState=" + ttransitionState);
            //console.log("tpreExponential=" + tpreExponential);
            //console.log("tactivationEnergy=" + tactivationEnergy);
            //console.log("ttInfinity=" + ttInfinity);
            //console.log("tnInfinity=" + tnInfinity);
            table +=getTR(getTD(id) + getTD(treactants) + getTD(tproducts) + getTD(ttransitionState) + getTD(tpreExponential) + getTD(tactivationEnergy) + getTD(ttInfinity) + getTD(tnInfinity));
            //console.log("table=" + table);
        }
    }
    //console.log("table=" + table);
    console.log("Reactions:");
    reactionsInformation.forEach(function (reactionMap, id) {
        //console.log(id);
        reactionMap.forEach(function (v, k) {
            if (v instanceof Set) {
                //console.log(k + '=' + Array.from(v));
            } else {
                //console.log(k + '=' + v);
            }
        })
    })
    //console.log("Returning table...");
    return table;
}
*/

/**
 * Parses xml and returns a map of molecules.
 * @param {XMLDocument} xml The XML document.
 * @returns {Map<string, Molecule>} A map of molecules.
 */
function getMolecules(xml: XMLDocument) : Map<string, Molecule> {
    console.log("getMolecules");
    let xml_molecules = xml.getElementsByTagName('moleculeList')[0].getElementsByTagName('molecule');
    let xml_molecules_length = xml_molecules.length;
    console.log("Number of molecules=" + xml_molecules_length);
    // Process each molecule.
    for (let i = 0; i < xml_molecules.length; i++) {
        var energy = "";
        var rotationalConstants = "";
        var vibrationalFrequencies = "";
        let id = xml_molecules[i].getAttribute("id");
        //console.log("id=" + id);
        let description = xml_molecules[i].getAttribute("description");
        let active_string: string = xml_molecules[i].getAttribute("active");
        let active: boolean = false;
        if (active_string != null) {
            active = true;
        }
        // Read atomArray
        const atoms: Map<string, Atom> = new Map();
        let xml_atomArray = xml_molecules[i].getElementsByTagName("atomArray")[0];
        if (xml_atomArray != null) {
            let xml_atoms = xml_atomArray.getElementsByTagName("atom");
            for (let j = 0; j < xml_atoms.length; j++) {
                let xml_atom = xml_atoms[j];
                let id: string = xml_atom.getAttribute("id");
                let atom = new Atom(id, xml_atom.getAttribute("elementType"));
                //console.log(atom.toString());
                atoms.set(id, atom);
            }
        }
        // Read bondArray
        const bonds: Map<string, Bond> = new Map();
        let xml_bondArray = xml_molecules[i].getElementsByTagName("bondArray")[0];
        if (xml_bondArray != null) {
            let xml_bonds = xml_bondArray.getElementsByTagName("bond");
            for (let j = 0; j < xml_bonds.length; j++) {
                let xml_bond = xml_bonds[j];
                let atomRefs2: string[] = xml_bond.getAttribute("atomRefs2").split(" ");
                let bond = new Bond(atoms.get(atomRefs2[0]), atoms.get(atomRefs2[1]), xml_bond.getAttribute("order"));
                //console.log(bond.toString());
                bonds.set(id, bond);
            }
        }
        // Read propertyList
        const properties: Map<string, PropertyScalar | PropertyArray> = new Map();
        let xml_propertyList = xml_molecules[i].getElementsByTagName("propertyList")[0];
        if (xml_propertyList != null) {
            let xml_properties = xml_propertyList.getElementsByTagName("property");
            for (let j = 0; j < xml_properties.length; j++) {
                let dictRef = xml_properties[j].getAttribute("dictRef");
                console.log("dictRef=" + dictRef);
                if (dictRef != null) {
                    if (dictRef === "me:ZPE") {
                        //console.log("dictRef=" + dictRef);
                        let xml_scalar = xml_properties[j].getElementsByTagName("scalar")[0];
                        if (xml_scalar != null) {
                            let units = xml_scalar.getAttribute("units");
                            //console.log("units=" + units);
                            let energy = parseFloat(xml_scalar.childNodes[0].nodeValue);
                            minMoleculeEnergy = Math.min(minMoleculeEnergy, energy);
                            maxMoleculeEnergy = Math.max(maxMoleculeEnergy, energy);
                            properties.set(dictRef, new PropertyScalar(energy, units));
                            console.log("energy=" + energy);
                        }
                    } else if (dictRef === "me:rotConsts") {
                        //console.log("dictRef=" + dictRef);
                        let xml_array = xml_properties[j].getElementsByTagName("array")[0];
                        if (xml_array != null) {
                            let units = xml_array.getAttribute("units");
                            //console.log("units=" + units);
                            let rotationalConstants = xml_array.childNodes[0];
                            if (rotationalConstants != null) {
                                let values: number[] = toNumberArray(rotationalConstants.nodeValue.split(" "));
                                properties.set(dictRef, new PropertyArray(values, units));
                                console.log("rotationalConstants=" + rotationalConstants);
                            }
                        }
                    } else if (dictRef === "me:vibFreqs") {
                        let xml_array = xml_properties[j].getElementsByTagName("array")[0];
                        if (xml_array != null) {
                            let units = xml_array.getAttribute("units");
                            //console.log("units=" + units);
                            let vibrationalFrequencies = xml_array.childNodes[0];
                            if (vibrationalFrequencies != null) {
                                let values: number[] = toNumberArray(vibrationalFrequencies.nodeValue.split(" "));
                                properties.set(dictRef, new PropertyArray(values, units));
                                console.log("vibrationalFrequencies=" + vibrationalFrequencies);
                            }
                        }
                    } else {
                        //console.log("dictRef=" + dictRef);
                    }
                }
            }
        }
        // Read DOSCMethod
        let dOSCMethod: string = "";
        let xml_DOSCMethod = xml_molecules[i].getElementsByTagName("me:DOSCMethod")[0];
        if (xml_DOSCMethod != null) {
            dOSCMethod = xml_DOSCMethod.getAttribute("xsi:type");
        }
        let molecule = new Molecule(id, description, active, atoms, bonds, properties, dOSCMethod);
        console.log(molecule.toString());
        molecules.set(id, molecule);
    }
    return molecules;
}

/**
 * @param s The string to convert to a number array.
 * @returns A number array.
 */
function toNumberArray(s: string[]): number[] {
    let r: number[] = [];
    for (let i = 0; i < s.length; i++) {
        r.push(parseFloat(s[i]));
    }
    return r;
}

/**
* Count the number of elements with a specific attribute.
* @param Element[] elements
* @param String attribute_name
* @returns int
*/
function count(elements, attribute_name) {
    let r = 0;
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute(attribute_name) != null) {
            r++;
        }
    }
    return r;
}

/**
 * Create a table header row.
* @param {string[]} headings The headings.
* @returns {string} Table row with headings.
*/
function getTH(headings: string[]): string {
    var th = "";
    for (let i = 0; i < headings.length; i++) {
        th += "<th>" + headings[i] + "</th>"
    }
    return getTR(th);
}

/**
 * Create a table cell.
* @param {string} x A cell for a table row.
* @returns {string} x wrapped in td tags.
*/
function getTD(x: string): string {
    return "<td>" + x + "</td>";
}

/**
 * Create a table row.
* @param {string} x A row for a table.
* @returns {string} x wrapped in tr tags.
*/
function getTR(x: string): string {
    return "<tr>" + x + "</tr>\n";
}

/**
 * Create a table.
* @param {string} x Table rows for a table.
* @returns {string} x wrapped in table tags.
*/
function getTable(x: string): string {
    return "<table>" + x + "</table>";
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

/*
function createDiagram() {
    console.log("createDiagram");
    const canvas=document.getElementById("diagram");
    const ctx=canvas.getContext("2d");
    ctx.fillStyle="#FF0000";
    canvas.height=canvas.width;
    console.log("canvas.width=" + canvas.width);
    console.log("canvas.height=" + canvas.height);
    ctx.transform(1, 0, 0, -1, 0, canvas.height)

    // Get text height for font size.
    let th=getTextHeight(ctx, "Aj");
    console.log("th=" + th);

    let black="black";
    let green="green";

    // The number of reactions and transitions.
    var nReactionsAndTransitions=reactionsInformation.size + transitions.size;
    console.log("nReactionsAndTransitions=" + nReactionsAndTransitions);

    let xMax=canvas.height;
    let slope=0.5;

    //let firstReaction=reactionsInformation.entries().next().key;
    //console.log("firstReaction=" + firstReaction);
    //let intercept=moleculeEnergies.get(firstReaction);

    let x00=0;
    let y00=null;

    // Go through reactionInformation and draw lines.
    reactionsInformation.forEach(function (reactionMap, id) {
        console.log("id=" + id);
        let reactants=reactionMap.get("reactants");
        let firstReactant=reactants.values().next().value;
        console.log("firstReactant=" + firstReactant);
        let reactantLabel=reactionMap.get("reactantLabel");
        console.log("reactantLabel=" + reactantLabel);
        let y01=moleculeEnergies.get(firstReactant);
        console.log("moleculeEnergy=" + y01);
        // Get text width.
        let tw=Math.max(getTextWidth(ctx, y01), getTextWidth(ctx, reactantLabel));
        console.log("tw=" + tw);
        let x01=x00 + tw;
        if (y00==null) {
            y00=y01;
            // Draw horizontal line and add label.
            drawLevel(ctx, green, 4, x00, y00, x01, y01, th, reactantLabel);
            x00=x01;
            let x0=x01;
            let y0=y01;
            // Get Product
            let products=reactionMap.get("products");
            console.log("products=" + products);
            console.log("products.size=" + products.size);
            let i=0;
            reactionMap.get("products").forEach(function (product) {
                console.log("product=" + product);
                i++;
                let y1=moleculeEnergies.get(product);
                if (y1==null) {
                    console.log("y1=" + y1);
                    throw "exit";
                } else {
                    let x1=x0 + (tw * i);
                    console.log("moleculeEnergy=" + y1);
                    // Draw connector line.
                    drawLine(ctx, black, 2, x0, y0, x1, y1);
                    x0=x1;
                    x1=x0 + tw;
                    y0=y1;
                    throw "exit";
                }
            });
        } else {
            let tss=reactantToTransitionStates.get(reactantLabel);
            if (tss !=null) {
                let x0=x01;
                let y0=y01;
                let i=0;
                // Iterate over each transition state.
                tss.forEach(function (ts) {
                    i++;
                    console.log("ts=" + ts);
                    let y1=moleculeEnergies.get(ts);
                    let x1=x0 + (tw * i);
                    console.log("moleculeEnergy=" + y1);
                    tw=Math.max(getTextWidth(ctx, y1), getTextWidth(ctx, ts));
                    reactantLabel=ts;
                    // Draw connector line.
                    drawLine(ctx, black, 2, x0, y0, x1, y1);
                    x0=x1;
                    x1=x0 + tw;
                    y0=y1;
                    // Draw horizontal line and add label.
                    drawLevel(ctx, green, 4, x0, y0, x1, y1, th, reactantLabel);
                    x0=x1;
                });
            } else {
                // Draw connector line.
                drawLine(ctx, black, 2, x00, y00, x01, y01);
                x00=x01;
                x01=x00 + tw;
                y00=y01;
                // Draw horizontal line and add label.
                drawLevel(ctx, green, 4, x00, y00, x01, y00, th, reactantLabel);
                x00=x01;
            }
        }
    })
    console.log(intercept);

    function f(x) {
        return x * slope + intercept;
    }
    return canvas
}
*/

function drawLevel(ctx, strokeStyle, strokewidth, x0, y0, x1, y1, th, reactantLabel) {
    writeText(ctx, y1, strokeStyle, x0, y1 + th);
    writeText(ctx, reactantLabel, strokeStyle, x0, y1 - th);
    drawLine(ctx, strokeStyle, strokewidth, x0, y0, x1, y1);
}

/**
 * Draw a line (segment) on the canvas.
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} strokeStyle The name of a style to use for the line.
 * @param {Integer} x1 The start x-coordinate of the line.
 * @param {Integer} y1 The start y-coordinate of the line.
 * @param {Integer} x2 The end x-coordinate of the line.
 * @param {Integer} y2 The end y-coordinate of the line.
 */
function drawLine(ctx: CanvasRenderingContext2D, strokeStyle: string, strokewidth: number,
    x1: number, y1: number, x2: number, y2: number) {
    // Save the context (to restore after).
    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokewidth;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Restore the context.
    ctx.restore();
}

/**
 * Writes text to the canvas. (It is probably better to write all the labels in one go.)
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to write.
 * @param {string} colour The colour of the text.
 * @param {number} x The horizontal position of the text.
 * @param {number} y The vertical position of the text.
 */
function writeText(ctx: CanvasRenderingContext2D, text: string, colour: string, x: number, y: number) {
    // Save the context (to restore after).
    ctx.save();
    // Translate to the point where text is to be added.
    ctx.translate(x, y);
    // Invert Y-axis.
    ctx.scale(1, -1);
    // Set the text colour.
    ctx.fillStyle = colour;
    // Write the text.
    ctx.fillText(text, 0, 0);
    // Restore the context.
    ctx.restore();
}

/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the height of.
 * @returns {number} The height of the text in pixels.
 */
function getTextHeight(ctx: CanvasRenderingContext2D, text: string): number {
    var fontMetric = ctx.measureText(text);
    return fontMetric.actualBoundingBoxAscent + fontMetric.actualBoundingBoxDescent;
}

/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the width of.
 * @returns {number} The width of the text in pixels.
 */
function getTextWidth(ctx: CanvasRenderingContext2D, text: string): number {
    return ctx.measureText(text).width;
}