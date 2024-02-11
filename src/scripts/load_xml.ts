import {
    ActivationEnergy,
    Atom,
    Bond,
    DefinedSumOfStates,
    MCRCMethod,
    MesmerILT,
    Molecule,
    NInfinity,
    PreExponential,
    Product,
    PropertyArray,
    PropertyScalar,
    Reactant,
    Reaction,
    ReactionWithTransitionState,
    TransitionState,
    Tunneling,
    ZhuNakamuraCrossing
} from './classes.js';

import {
    arrayToString, mapToString, toNumberArray
} from './functions.js';

import {
    getTD, getTH, getTR
} from './html.js';

import {
    drawLevel,
    drawLine,
    getTextHeight, getTextWidth
} from './canvas.js';
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
                //console.log("text=" + text);
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
        let rotationConstants: string = arrayToString(molecule.getRotationConstants());
        let vibrationFrequencies: string = arrayToString(molecule.getVibrationFrequencies());
        moleculesTable += getTR(getTD(id) + getTD(energy) + getTD(rotationConstants) + getTD(vibrationFrequencies));
    });
    const moleculesElement = document.getElementById("molecules");
    if (moleculesElement !== null) {
        moleculesElement.innerHTML = moleculesTable;
    }

    /**
     * Generate reactions table.
     */
    let reactions: Map<string, Reaction> = getReactions(xml, molecules);
    // Prepare table headings.
    let reactionsTable = getTH(["ID", "Reactants", "Products", "Transition State",
        "PreExponential", "Activation Energy", "TInfinity", "NInfinity"]);
    reactions.forEach(function (reaction, id) {
        //console.log("id=" + id);
        //console.log("reaction=" + reaction);
        let reactants: string = arrayToString(Array.from(reaction.reactants.keys()));
        let products: string = arrayToString(Array.from(reaction.products.keys()));
        let transitionState: string = "";
        let preExponential: string = "";
        let activationEnergy: string = "";
        let tInfinity: string = "";
        let nInfinity: string = "";
        if (reaction instanceof ReactionWithTransitionState) {
            transitionState = reaction.transitionState.getName();
        }
        let mCRCMethod: MCRCMethod = reaction.mCRCMethod;
        if (mCRCMethod != null) {
            if (mCRCMethod instanceof MesmerILT) {
                preExponential = mCRCMethod.preExponential.value.toString() + " " + mCRCMethod.preExponential.units;
                activationEnergy = mCRCMethod.activationEnergy.value.toString() + " " + mCRCMethod.activationEnergy.units;
                tInfinity = mCRCMethod.tInfinity.toString();
                nInfinity = mCRCMethod.nInfinity.value.toString();
            } else if (mCRCMethod instanceof ZhuNakamuraCrossing) {
            } else if (mCRCMethod instanceof DefinedSumOfStates) {
            } else {
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
     * Generate reactions diagram.
     */
    let canvas: HTMLCanvasElement = document.getElementById("diagram") as HTMLCanvasElement;
    let font: string = "14px Arial";
    let dark: boolean = true;
    let lw: number = 4;
    let lwc: number = 2;
    if (canvas !== null) {
        drawReactionDiagram(canvas, molecules, reactions, dark, font, lw, lwc);
    }
}


/**
 * Parses xml and returns a map of molecules.
 * @param {XMLDocument} xml The XML document.
 * @returns {Map<string, Molecule>} A map of molecules.
 */
function getMolecules(xml: XMLDocument): Map<string, Molecule> {
    console.log("getMolecules");
    let molecules = new Map<string, Molecule>([]);
    let xml_molecules = xml.getElementsByTagName('moleculeList')[0].getElementsByTagName('molecule');
    let xml_molecules_length = xml_molecules.length;
    console.log("Number of molecules=" + xml_molecules_length);
    // Process each molecule.
    for (let i = 0; i < xml_molecules.length; i++) {
        //var energy = "";
        //var rotationalConstants = "";
        //var vibrationalFrequencies = "";
        let id = xml_molecules[i].getAttribute("id");
        console.log("id=" + id);
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
                let atomRefs2: string[] = xml_bond.getAttribute("atomRefs2").trim().split(" ");
                let bond = new Bond(atoms.get(atomRefs2[0]), atoms.get(atomRefs2[1]), xml_bond.getAttribute("order"));
                //console.log(bond.toString());
                bonds.set(id, bond);
            }
        }
        // Read propertyList
        const properties: Map<string, PropertyScalar | PropertyArray> = new Map();
        // The following does not work because sometimes there is a single property not in propertyList!
        //let xml_propertyList = xml_molecules[i].getElementsByTagName("propertyList")[0];
        //if (xml_propertyList != null) {
        //    let xml_properties = xml_propertyList.getElementsByTagName("property");
        let xml_properties = xml_molecules[i].getElementsByTagName("property");
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
                } else if (dictRef === "me:rotConsts") {
                    //console.log("dictRef=" + dictRef);
                    let xml_array = xml_properties[j].getElementsByTagName("array")[0];
                    if (xml_array != null) {
                        let units = xml_array.getAttribute("units");
                        //console.log("units=" + units);
                        let rotationalConstants = xml_array.childNodes[0];
                        if (rotationalConstants != null) {
                            let values: number[] = toNumberArray(rotationalConstants.nodeValue.trim().split(" "));
                            properties.set(dictRef, new PropertyArray(values, units));
                        }
                    }
                } else if (dictRef === "me:vibFreqs") {
                    let xml_array = xml_properties[j].getElementsByTagName("array")[0];
                    if (xml_array != null) {
                        let units = xml_array.getAttribute("units");
                        //console.log("units=" + units);
                        let vibrationalFrequencies = xml_array.childNodes[0];
                        if (vibrationalFrequencies != null) {
                            let values: number[] = toNumberArray(vibrationalFrequencies.nodeValue.trim().split(" "));
                            properties.set(dictRef, new PropertyArray(values, units));
                        }
                    }
                } else {
                    //console.log("dictRef=" + dictRef);
                }
            }
        }
        //}
        // Read DOSCMethod
        let dOSCMethod: string = "";
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
function getReactions(xml: XMLDocument, molecules: Map<string, Molecule>): Map<string, Reaction> {
    console.log("getReactions");
    let reactions = new Map<string, Reaction>([]);
    let xml_reactions = xml.getElementsByTagName('reactionList')[0].getElementsByTagName('reaction');
    let xml_reactions_length = xml_reactions.length;
    console.log("Number of reactions=" + xml_reactions_length);
    // Process each reaction.
    for (let i = 0; i < xml_reactions_length; i++) {
        let reactionID = xml_reactions[i].getAttribute("id");
        let xml_active = xml_reactions[i].getAttribute("active");
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
                let reactant: Reactant;
                let xml_molecule = xml_reactants[j].getElementsByTagName('molecule')[0];
                let moleculeID: string = xml_molecule.getAttribute("ref");
                let role: string = xml_molecule.getAttribute("role");
                let molecule: Molecule = molecules.get(moleculeID);
                if (molecule != null) {
                    reactant = new Reactant(molecule, role);
                    reactants.set(moleculeID, reactant);
                } else {
                    console.log("WARNING: No molecule with id=" + moleculeID + " failed to add reactant in reaction.");
                }
            }
            // Load products.
            let products: Map<string, Product> = new Map([]);
            let xml_products = xml_reactions[i].getElementsByTagName('product');
            for (let j = 0; j < xml_products.length; j++) {
                let product: Product;
                let xml_molecule = xml_products[j].getElementsByTagName('molecule')[0];
                let moleculeID: string = xml_molecule.getAttribute("ref");
                let role: string = xml_molecule.getAttribute("role");
                let molecule: Molecule = molecules.get(moleculeID);
                if (molecule != null) {
                    product = new Product(molecule, role);
                    products.set(moleculeID, product);
                } else {
                    console.log("WARNING: No molecule with id=" + moleculeID + " failed to add product in reaction.");
                }
            }
            // Load MCRCMethod.
            let mCRCMethod: MCRCMethod;
            let xml_MCRCMethod = xml_reactions[i].getElementsByTagName('me:MCRCMethod');
            if (xml_MCRCMethod.length > 0) {
                let name: string;
                let xml_name = xml_MCRCMethod[0].getAttribute("name");
                if (xml_name != null) {
                    name = xml_name;
                }
                let xsi_type: string;
                let xml_xsi_type = xml_MCRCMethod[0].getAttribute("xsi:type");
                if (xml_xsi_type != null) {
                    xsi_type = xml_xsi_type;
                    if (xsi_type === "me:MesmerILT") {
                        let preExponential: PreExponential;
                        let xml_preExponential = xml_MCRCMethod[0].getElementsByTagName("me:preExponential");
                        if (xml_preExponential != null) {
                            if (xml_preExponential[0] != null) {
                                let value: number = parseFloat(xml_preExponential[0].childNodes[0].nodeValue);
                                let units: string = xml_preExponential[0].getAttribute("units");
                                let lower: number;
                                let xml_lower = xml_preExponential[0].getAttribute("lower");
                                if (xml_lower != null) {
                                    lower = parseFloat(xml_lower);
                                }
                                let upper: number;
                                let xml_upper = xml_preExponential[0].getAttribute("upper");
                                if (xml_upper != null) {
                                    upper = parseFloat(xml_upper);
                                }
                                let stepsize: number;
                                let xml_stepsize = xml_preExponential[0].getAttribute("stepsize");
                                if (xml_stepsize != null) {
                                    stepsize = parseFloat(xml_stepsize);
                                }
                                preExponential = new PreExponential(value, units, lower, upper, stepsize);
                            }
                        }
                        let activationEnergy: ActivationEnergy;
                        let xml_activationEnergy = xml_MCRCMethod[0].getElementsByTagName("me:activationEnergy");
                        if (xml_activationEnergy != null) {
                            if (xml_activationEnergy[0] != null) {
                                let value: number = parseFloat(xml_activationEnergy[0].childNodes[0].nodeValue);
                                let units: string = xml_activationEnergy[0].getAttribute("units");
                                activationEnergy = new ActivationEnergy(value, units);
                            }
                        }
                        let tInfinity: number;
                        let xml_tInfinity = xml_MCRCMethod[0].getElementsByTagName("me:TInfinity");
                        if (xml_tInfinity != null) {
                            if (xml_tInfinity[0] != null) {
                                tInfinity = parseFloat(xml_tInfinity[0].childNodes[0].nodeValue);
                            }
                        }
                        let nInfinity: NInfinity;
                        let xml_nInfinity = xml_MCRCMethod[0].getElementsByTagName("me:nInfinity");
                        if (xml_nInfinity != null) {
                            if (xml_nInfinity[0] != null) {
                                let value: number = parseFloat(xml_nInfinity[0].childNodes[0].nodeValue);
                                let units: string;
                                let xml_units = xml_nInfinity[0].getAttribute("units");
                                if (xml_units != null) {
                                    units = xml_units;
                                }
                                let lower: number;
                                let xml_lower = xml_nInfinity[0].getAttribute("lower");
                                if (xml_lower != null) {
                                    lower = parseFloat(xml_lower);
                                }
                                let upper: number;
                                let xml_upper = xml_nInfinity[0].getAttribute("upper");
                                if (xml_upper != null) {
                                    upper = parseFloat(xml_upper);
                                }
                                let stepsize: number;
                                let xml_stepsize = xml_nInfinity[0].getAttribute("stepsize");
                                if (xml_stepsize != null) {
                                    stepsize = parseFloat(xml_stepsize);
                                }
                                nInfinity = new NInfinity(value, units, lower, upper, stepsize);
                            }
                        }
                        mCRCMethod = new MesmerILT(name, xsi_type, preExponential, activationEnergy, tInfinity, nInfinity);
                    } else {
                        mCRCMethod = new MCRCMethod(name, xsi_type);
                    }
                } else {
                    mCRCMethod = new MCRCMethod(name, xsi_type);
                }
            }
            // Load transition state.
            let transitionState: TransitionState;
            let xml_transitionState = xml_reactions[i].getElementsByTagName('me:transitionState');
            if (xml_transitionState.length > 0) {
                let xml_molecule = xml_transitionState[0].getElementsByTagName('molecule')[0];
                let moleculeID = xml_molecule.getAttribute("ref");
                let role = xml_molecule.getAttribute("role");
                transitionState = new TransitionState(molecules.get(moleculeID), role);
                // Load tunneling.
                let xml_tunneling = xml_reactions[i].getElementsByTagName('me:tunneling');
                let tunneling: Tunneling;
                if (xml_tunneling.length > 0) {
                    tunneling = new Tunneling(xml_tunneling[0].getAttribute("name"));
                }
                let reaction = new ReactionWithTransitionState(reactionID, active, reactants, products, mCRCMethod, transitionState, tunneling);
                reactions.set(reactionID, reaction);
                //console.log("reaction=" + reaction);
            } else {
                let reaction = new Reaction(reactionID, active, reactants, products, mCRCMethod);
                reactions.set(reactionID, reaction);
                //console.log("reaction=" + reaction);
            }
        }
    }
    return reactions;
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
    console.log("getReactionDiagram");
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
    console.log("th=" + th);

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
    let energyMax: number = 0;
    reactions.forEach(function (reaction, id) {
        // Get TransitionState if there is one.
        let transitionState: TransitionState;
        if (reaction instanceof ReactionWithTransitionState) {
            transitionState = reaction.transitionState;
            //console.log("transitionState=" + transitionState);
        }
        //console.log("reactant=" + reactant);
        let reactantsLabel: string = reaction.getReactantsLabel();
        reactants.add(reactantsLabel);
        if (products.has(reactantsLabel)) {
            intProducts.add(reactantsLabel);
        }
        let energy: number = reaction.getReactantsEnergy();
        energyMax = Math.max(energyMax, energy);
        energies.set(reactantsLabel, energy);
        let productsLabel: string = reaction.getProductsLabel();
        products.add(productsLabel);
        energy = reaction.getProductsEnergy();
        energyMax = Math.max(energyMax, energy);
        energies.set(productsLabel, energy);
        if (!orders.has(reactantsLabel)) {
            orders.set(reactantsLabel, i);
            i++;
        }
        if (orders.has(productsLabel)) {
            i --;
            let j: number = orders.get(productsLabel);
            // Move product to end and shift everything back.
            orders.forEach(function (value, key) {
                if (value > j) {
                    orders.set(key, value - 1);
                }
            });
            // Insert transition state.
            if (transitionState != null) {
                let tsn: string = transitionState.getName();
                transitionStates.add(tsn);
                orders.set(tsn, i);
                energy = transitionState.molecule.getEnergy();
                energyMax = Math.max(energyMax, energy);
                energies.set(tsn, energy);
                i++;
            }
            orders.set(productsLabel, i);
            i++
        } else {
            if (transitionState != null) {
                let tsn: string = transitionState.getName();
                transitionStates.add(tsn);
                orders.set(tsn, i);
                energy = transitionState.molecule.getEnergy();
                energyMax = Math.max(energyMax, energy);
                energies.set(tsn, energy);
                i++;
            }
            orders.set(productsLabel, i);
            i++;
        }
    });
    console.log("orders=" + mapToString(orders));
    console.log("energies=" + mapToString(energies));
    console.log("energyMax=" + energyMax);
    console.log("reactants=" + reactants);
    console.log("products=" + products);
    console.log("transitionStates=" + transitionStates);

    // Create a lookup from order to label.
    let reorders: string[] = [];
    orders.forEach(function (value, key) {
        reorders[value] = key;
    });
    console.log("reorders=" + arrayToString(reorders));

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
        let energy: number = energies.get(value);
        // Get text width.
        tw = Math.max(getTextWidth(ctx, energy.toString(), font), getTextWidth(ctx, value, font));
        x1 = x0 + tw + textSpacing;
        y0 = energy + lw;
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
    console.log("canvas.width=" + canvas.width);
    // Set canvas height to maximum energy plus the label.
    canvas.height = energyMax + (4 * th) + (2 * lw);
    console.log("canvas.height=" + canvas.height);
    ctx.transform(1, 0, 0, -1, 0, canvas.height)

    // Go through reactions and draw connecting lines.
    reactions.forEach(function (reaction, id) {
        //console.log("id=" + id);
        //console.log("reaction=" + reaction);
        // Get TransitionState if there is one.
        let transitionState: TransitionState;
        if (reaction instanceof ReactionWithTransitionState) {
            transitionState = reaction.transitionState;
            //console.log("transitionState=" + transitionState);
        }
        //console.log("reactant=" + reactant);
        let reactantsLabel: string = reaction.getReactantsLabel();
        let productsLabel: string = reaction.getProductsLabel();
        let reactantOutXY: number[] = reactantsOutXY.get(reactantsLabel);
        let productInXY: number[] = productsInXY.get(productsLabel);
        if (transitionState != null) {
            let transitionStateLabel: string = transitionState.getName();
            let transitionStateInXY: number[] = transitionStatesInXY.get(transitionStateLabel);
            drawLine(ctx, black, lwc, reactantOutXY[0], reactantOutXY[1], transitionStateInXY[0], 
                transitionStateInXY[1]);
                let transitionStateOutXY: number[] = transitionStatesOutXY.get(transitionStateLabel);
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
        let energy: number = energies.get(value);
        let x0: number = reactantsInXY.get(value)[0];
        let y: number = energy + lw;
        let x1: number = reactantsOutXY.get(value)[0];
        let energyString: string = energy.toString();
        drawLevel(ctx, blue, lw, x0, y, x1, y, font, th, value, energyString);
    });
    products.forEach(function (value) {
        let energy: number = energies.get(value);
        let x0: number = productsInXY.get(value)[0];
        let y: number = energy+ lw;
        let x1: number = productsOutXY.get(value)[0];
        let energyString: string = energy.toString();
        if (intProducts.has(value)) {
            drawLevel(ctx, orange, lw, x0, y, x1, y, font, th, value, energyString);
        } else {
            drawLevel(ctx, green, lw, x0, y, x1, y, font, th, value, energyString);
        }
    });
    transitionStates.forEach(function (value) {
        let energy: number = energies.get(value);
        let x0: number = transitionStatesInXY.get(value)[0];
        let y: number = energy + lw;
        let x1: number = transitionStatesOutXY.get(value)[0];
        let energyString: string = energy.toString();
        drawLevel(ctx, red, lw, x0, y, x1, y, font, th, value, energyString);
    });
}