import { Atom, Bond, PropertyScalar, PropertyArray, Molecule, Reactant, Product, TransitionState, PreExponential, ActivationEnergy, NInfinity, MesmerILT, MCRCMethod, ZhuNakamuraCrossing, DefinedSumOfStates, Reaction, ReactionWithTransitionState, Tunneling } from './classes.js';
import { arrayToString, toNumberArray } from './functions.js';
//import {JSDOM} from 'jsdom'; // Can't use JSDOM in a browser.
/**
 * A map of molecules with Molecule.id as key and Molecules as values.
 */
const molecules = new Map([]);
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
const reactions = new Map([]);
const xmlTextElement = document.getElementById("xml_text");
if (xmlTextElement) {
    xmlTextElement.innerHTML = load('/src/data/examples/AcetylO2/Acetyl_O2_associationEx.xml');
}
/**
 * Load a specific XML File
 */
function load(xmlFile) {
    console.log("xmlFile=" + xmlFile);
    let xml;
    let text;
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
function parseXML(xml) {
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
    let molecules = getMolecules(xml);
    // Prepare table headings.
    let moleculesTable = getTH([
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
            energy = molecule.getEnergy().toString();
        }
        let rotationConstants = arrayToString(molecule.getRotationConstants());
        let vibrationFrequencies = arrayToString(molecule.getVibrationFrequencies());
        moleculesTable += getTR(getTD(id) + getTD(energy) + getTD(rotationConstants) + getTD(vibrationFrequencies));
    });
    const moleculesElement = document.getElementById("molecules");
    if (moleculesElement !== null) {
        moleculesElement.innerHTML = moleculesTable;
    }
    /**
     * Generate reactions table.
     */
    let reactions = getReactions(xml, molecules);
    // Prepare table headings.
    let reactionsTable = getTH(["ID", "Reactants", "Products", "Transition State",
        "PreExponential", "Activation Energy", "TInfinity", "NInfinity"]);
    reactions.forEach(function (reaction, id) {
        console.log("id=" + id);
        console.log("reaction=" + reaction);
        let reactants = arrayToString(Array.from(reaction.reactants.keys()));
        let products = arrayToString(Array.from(reaction.products.keys()));
        let transitionState = "";
        let preExponential = "";
        let activationEnergy = "";
        let tInfinity = "";
        let nInfinity = "";
        if (reaction instanceof ReactionWithTransitionState) {
            let transitionStateID = reaction.transitionState.molecule.id;
            let transitionStateRole = reaction.transitionState.role;
            if (transitionStateID != null) {
                transitionState += transitionStateID;
                if (transitionStateRole != null) {
                    transitionState += " " + transitionStateRole;
                }
            }
        }
        let mCRCMethod = reaction.mCRCMethod;
        if (mCRCMethod != null) {
            if (mCRCMethod instanceof MesmerILT) {
                preExponential = mCRCMethod.preExponential.value.toString() + " " + mCRCMethod.preExponential.units;
                activationEnergy = mCRCMethod.activationEnergy.value.toString() + " " + mCRCMethod.activationEnergy.units;
                tInfinity = mCRCMethod.tInfinity.toString();
                nInfinity = mCRCMethod.nInfinity.value.toString();
            }
            else if (mCRCMethod instanceof ZhuNakamuraCrossing) {
            }
            else if (mCRCMethod instanceof DefinedSumOfStates) {
            }
            else {
            }
        }
        reactionsTable += getTR(getTD(id) + getTD(reactants) + getTD(products) + getTD(transitionState)
            + getTD(preExponential) + getTD(activationEnergy) + getTD(tInfinity) + getTD(nInfinity));
        const reactionsElement = document.getElementById("reactions");
        if (reactionsElement !== null) {
            reactionsElement.innerHTML = reactionsTable;
        }
    });
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
 * Parses xml and returns a map of molecules.
 * @param {XMLDocument} xml The XML document.
 * @returns {Map<string, Molecule>} A map of molecules.
 */
function getMolecules(xml) {
    console.log("getMolecules");
    let molecules = new Map([]);
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
        let active_string = xml_molecules[i].getAttribute("active");
        let active = false;
        if (active_string != null) {
            active = true;
        }
        // Read atomArray
        const atoms = new Map();
        let xml_atomArray = xml_molecules[i].getElementsByTagName("atomArray")[0];
        if (xml_atomArray != null) {
            let xml_atoms = xml_atomArray.getElementsByTagName("atom");
            for (let j = 0; j < xml_atoms.length; j++) {
                let xml_atom = xml_atoms[j];
                let id = xml_atom.getAttribute("id");
                let atom = new Atom(id, xml_atom.getAttribute("elementType"));
                //console.log(atom.toString());
                atoms.set(id, atom);
            }
        }
        // Read bondArray
        const bonds = new Map();
        let xml_bondArray = xml_molecules[i].getElementsByTagName("bondArray")[0];
        if (xml_bondArray != null) {
            let xml_bonds = xml_bondArray.getElementsByTagName("bond");
            for (let j = 0; j < xml_bonds.length; j++) {
                let xml_bond = xml_bonds[j];
                let atomRefs2 = xml_bond.getAttribute("atomRefs2").trim().split(" ");
                let bond = new Bond(atoms.get(atomRefs2[0]), atoms.get(atomRefs2[1]), xml_bond.getAttribute("order"));
                //console.log(bond.toString());
                bonds.set(id, bond);
            }
        }
        // Read propertyList
        const properties = new Map();
        let xml_propertyList = xml_molecules[i].getElementsByTagName("propertyList")[0];
        if (xml_propertyList != null) {
            let xml_properties = xml_propertyList.getElementsByTagName("property");
            for (let j = 0; j < xml_properties.length; j++) {
                let dictRef = xml_properties[j].getAttribute("dictRef");
                //console.log("dictRef=" + dictRef);
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
                            //console.log("energy=" + energy);
                        }
                    }
                    else if (dictRef === "me:rotConsts") {
                        //console.log("dictRef=" + dictRef);
                        let xml_array = xml_properties[j].getElementsByTagName("array")[0];
                        if (xml_array != null) {
                            let units = xml_array.getAttribute("units");
                            //console.log("units=" + units);
                            let rotationalConstants = xml_array.childNodes[0];
                            if (rotationalConstants != null) {
                                let values = toNumberArray(rotationalConstants.nodeValue.trim().split(" "));
                                properties.set(dictRef, new PropertyArray(values, units));
                            }
                        }
                    }
                    else if (dictRef === "me:vibFreqs") {
                        let xml_array = xml_properties[j].getElementsByTagName("array")[0];
                        if (xml_array != null) {
                            let units = xml_array.getAttribute("units");
                            //console.log("units=" + units);
                            let vibrationalFrequencies = xml_array.childNodes[0];
                            if (vibrationalFrequencies != null) {
                                let values = toNumberArray(vibrationalFrequencies.nodeValue.trim().split(" "));
                                properties.set(dictRef, new PropertyArray(values, units));
                            }
                        }
                    }
                    else {
                        //console.log("dictRef=" + dictRef);
                    }
                }
            }
        }
        // Read DOSCMethod
        let dOSCMethod = "";
        let xml_DOSCMethod = xml_molecules[i].getElementsByTagName("me:DOSCMethod")[0];
        if (xml_DOSCMethod != null) {
            dOSCMethod = xml_DOSCMethod.getAttribute("xsi:type");
        }
        let molecule = new Molecule(id, description, active, atoms, bonds, properties, dOSCMethod);
        //console.log(molecule.toString());
        molecules.set(id, molecule);
    }
    return molecules;
}
/**
 * Parses xml and returns a map of reactions.
 * @param {XMLDocument} xml The XML document.
 * @param {Map<string, Molecule>} molecules The molecules.
 * @returns {Map<string, Reactions>} A map of reactions.
 */
function getReactions(xml, molecules) {
    console.log("getReactions");
    let reactions = new Map([]);
    let xml_reactions = xml.getElementsByTagName('reactionList')[0].getElementsByTagName('reaction');
    let xml_reactions_length = xml_reactions.length;
    console.log("Number of reactions=" + xml_reactions_length);
    // Process each reaction.
    for (let i = 0; i < xml_reactions_length; i++) {
        let reactionID = xml_reactions[i].getAttribute("id");
        let xml_active = xml_reactions[i].getAttribute("active");
        let active = true;
        if (xml_active != null) {
            if (xml_active === "false") {
                active = false;
            }
        }
        if (reactionID != null) {
            console.log("id=" + reactionID);
            // Load reactants.
            let reactants = new Map([]);
            let xml_reactants = xml_reactions[i].getElementsByTagName('reactant');
            console.log("xml_reactants.length=" + xml_reactants.length);
            for (let j = 0; j < xml_reactants.length; j++) {
                let xml_molecule = xml_reactants[j].getElementsByTagName('molecule')[0];
                let moleculeID = xml_molecule.getAttribute("ref");
                console.log("id=" + moleculeID);
                let role = xml_molecule.getAttribute("role");
                let reactant = new Reactant(molecules.get(moleculeID), role);
                //console.log("reactant=" + reactant.toString());
                reactants.set(moleculeID, reactant);
            }
            // Load products.
            let products = new Map([]);
            let xml_products = xml_reactions[i].getElementsByTagName('product');
            for (let j = 0; j < xml_products.length; j++) {
                let xml_molecule = xml_products[j].getElementsByTagName('molecule')[0];
                let moleculeID = xml_molecule.getAttribute("ref");
                let role = xml_molecule.getAttribute("role");
                let product = new Product(molecules.get(moleculeID), role);
                //console.log("product=" + product.toString());
                products.set(moleculeID, product);
            }
            // Load MCRCMethod.
            let mCRCMethod;
            let xml_MCRCMethod = xml_reactions[i].getElementsByTagName('me:MCRCMethod');
            if (xml_MCRCMethod.length > 0) {
                let name;
                let xml_name = xml_MCRCMethod[0].getAttribute("name");
                if (xml_name != null) {
                    name = xml_name;
                }
                let xsi_type;
                let xml_xsi_type = xml_MCRCMethod[0].getAttribute("xsi:type");
                if (xml_xsi_type != null) {
                    xsi_type = xml_xsi_type;
                    if (xsi_type === "me:MesmerILT") {
                        let preExponential;
                        let xml_preExponential = xml_MCRCMethod[0].getElementsByTagName("me:preExponential");
                        if (xml_preExponential != null) {
                            if (xml_preExponential[0] != null) {
                                let value = parseFloat(xml_preExponential[0].childNodes[0].nodeValue);
                                let units = xml_preExponential[0].getAttribute("units");
                                let lower;
                                let xml_lower = xml_preExponential[0].getAttribute("lower");
                                if (xml_lower != null) {
                                    lower = parseFloat(xml_lower);
                                }
                                let upper;
                                let xml_upper = xml_preExponential[0].getAttribute("upper");
                                if (xml_upper != null) {
                                    upper = parseFloat(xml_upper);
                                }
                                let stepsize;
                                let xml_stepsize = xml_preExponential[0].getAttribute("stepsize");
                                if (xml_stepsize != null) {
                                    stepsize = parseFloat(xml_stepsize);
                                }
                                preExponential = new PreExponential(value, units, lower, upper, stepsize);
                            }
                        }
                        let activationEnergy;
                        let xml_activationEnergy = xml_MCRCMethod[0].getElementsByTagName("me:activationEnergy");
                        if (xml_activationEnergy != null) {
                            if (xml_activationEnergy[0] != null) {
                                let value = parseFloat(xml_activationEnergy[0].childNodes[0].nodeValue);
                                let units = xml_activationEnergy[0].getAttribute("units");
                                activationEnergy = new ActivationEnergy(value, units);
                            }
                        }
                        let tInfinity;
                        let xml_tInfinity = xml_MCRCMethod[0].getElementsByTagName("me:TInfinity");
                        if (xml_tInfinity != null) {
                            if (xml_tInfinity[0] != null) {
                                tInfinity = parseFloat(xml_tInfinity[0].childNodes[0].nodeValue);
                            }
                        }
                        let nInfinity;
                        let xml_nInfinity = xml_MCRCMethod[0].getElementsByTagName("me:nInfinity");
                        if (xml_nInfinity != null) {
                            if (xml_nInfinity[0] != null) {
                                let value = parseFloat(xml_nInfinity[0].childNodes[0].nodeValue);
                                let units;
                                let xml_units = xml_nInfinity[0].getAttribute("units");
                                if (xml_units != null) {
                                    units = xml_units;
                                }
                                let lower;
                                let xml_lower = xml_nInfinity[0].getAttribute("lower");
                                if (xml_lower != null) {
                                    lower = parseFloat(xml_lower);
                                }
                                let upper;
                                let xml_upper = xml_nInfinity[0].getAttribute("upper");
                                if (xml_upper != null) {
                                    upper = parseFloat(xml_upper);
                                }
                                let stepsize;
                                let xml_stepsize = xml_nInfinity[0].getAttribute("stepsize");
                                if (xml_stepsize != null) {
                                    stepsize = parseFloat(xml_stepsize);
                                }
                                nInfinity = new NInfinity(value, units, lower, upper, stepsize);
                            }
                        }
                        mCRCMethod = new MesmerILT(name, xsi_type, preExponential, activationEnergy, tInfinity, nInfinity);
                    }
                    else {
                        mCRCMethod = new MCRCMethod(name, xsi_type);
                    }
                }
                else {
                    mCRCMethod = new MCRCMethod(name, xsi_type);
                }
            }
            // Load transition state.
            let transitionState;
            let xml_transitionState = xml_reactions[i].getElementsByTagName('me:transitionState');
            if (xml_transitionState.length > 0) {
                let xml_molecule = xml_transitionState[0].getElementsByTagName('molecule')[0];
                let moleculeID = xml_molecule.getAttribute("ref");
                let role = xml_molecule.getAttribute("role");
                transitionState = new TransitionState(molecules.get(moleculeID), role);
                // Load tunneling.
                let xml_tunneling = xml_reactions[i].getElementsByTagName('me:tunneling');
                let tunneling;
                if (xml_tunneling.length > 0) {
                    tunneling = new Tunneling(xml_tunneling[0].getAttribute("name"));
                }
                let reaction = new ReactionWithTransitionState(reactionID, active, reactants, products, mCRCMethod, transitionState, tunneling);
                reactions.set(reactionID, reaction);
                console.log("reaction=" + reaction);
            }
            else {
                let reaction = new Reaction(reactionID, active, reactants, products, mCRCMethod);
                reactions.set(reactionID, reaction);
                console.log("reaction=" + reaction);
            }
        }
    }
    return reactions;
}
/**
 * Create a table header row.
* @param {string[]} headings The headings.
* @returns {string} Table row with headings.
*/
function getTH(headings) {
    var th = "";
    for (let i = 0; i < headings.length; i++) {
        th += "<th>" + headings[i] + "</th>";
    }
    return getTR(th);
}
/**
 * Create a table cell.
* @param {string} x A cell for a table row.
* @returns {string} x wrapped in td tags.
*/
function getTD(x) {
    return "<td>" + x + "</td>";
}
/**
 * Create a table row.
* @param {string} x A row for a table.
* @returns {string} x wrapped in tr tags.
*/
function getTR(x) {
    return "<tr>" + x + "</tr>\n";
}
/**
 * Create a table.
* @param {string} x Table rows for a table.
* @returns {string} x wrapped in table tags.
*/
function getTable(x) {
    return "<table>" + x + "</table>";
}
/**
 * Convert XML to HTML.
 * @param {string} text The XML text.
 * @returns {string} The HTML text.
 */
function XMLToHTML(text) {
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
function drawLine(ctx, strokeStyle, strokewidth, x1, y1, x2, y2) {
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
function writeText(ctx, text, colour, x, y) {
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
function getTextHeight(ctx, text) {
    var fontMetric = ctx.measureText(text);
    return fontMetric.actualBoundingBoxAscent + fontMetric.actualBoundingBoxDescent;
}
/**
 * @param {CanvasRenderingContext2D} ctx The context to use.
 * @param {string} text The text to get the width of.
 * @returns {number} The width of the text in pixels.
 */
function getTextWidth(ctx, text) {
    return ctx.measureText(text).width;
}
