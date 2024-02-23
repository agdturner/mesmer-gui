"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Molecule = exports.DOSCMethod = exports.EnergyTransferModel = exports.DeltaEDown = exports.Property = exports.Bond = exports.Atom = void 0;
const classes_js_1 = require("./classes.js");
const functions_js_1 = require("./functions.js");
const xml_js_1 = require("./xml.js");
/**
 * A class for representing an atom.
 * @param {Map<string, string>} attributes The attributes.
 * If there is no "id" or "elementType" key an error will be thrown.
 */
class Atom extends classes_js_1.Attributes {
    /**
     * @param attributes The attributes. If there is no "id" or "elementType" key an error will be thrown.
     */
    constructor(attributes) {
        super(attributes);
        let id = attributes.get("id");
        if (id == undefined) {
            throw new Error('id is undefined');
        }
        let elementType = attributes.get("elementType");
        if (elementType == undefined) {
            throw new Error('elementType is undefined');
        }
    }
    /**
     * @returns A string representation.
     */
    toString() {
        let s = super.toString();
        return s + `)`;
    }
    /**
     * @returns The id of the atom.
     */
    get id() {
        return this.attributes.get("id");
    }
    /**
     * @returns The element type of the atom.
     */
    get elementType() {
        return this.attributes.get("elementType");
    }
}
exports.Atom = Atom;
/**
 * A class for representing an atomic bond - a bond beteen two atoms.
 * @param {Map<string, string>} attributes The attributes.
 * @param {Atom} atomA One atom.
 * @param {Atom} atomB Another atom.
 * @param {string} order The order of the bond.
 */
class Bond extends classes_js_1.Attributes {
    /**
     * @param {Map<string, string>} attributes The attributes.
     */
    constructor(attributes) {
        super(attributes);
    }
    /**
     * @returns A string representation.
     */
    toString() {
        let s = super.toString();
        return s + `)`;
    }
}
exports.Bond = Bond;
/**
 * A class for representing a property.
 */
class Property extends classes_js_1.Attributes {
    /**
     * The property value.
     */
    property;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {NumberWithAttributes | NumberArrayWithAttributes} property The property.
     */
    constructor(attributes, property) {
        super(attributes);
        this.property = property;
    }
    /**
     * @returns A string representation.
     */
    toString() {
        return super.toString() + ` property(${this.property.toString()}))`;
    }
    /**
     * @param padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(pad, padding) {
        let padding1 = undefined;
        if (pad != undefined) {
            if (padding != undefined) {
                padding1 = padding + pad;
            }
        }
        if (this.property instanceof classes_js_1.NumberWithAttributes) {
            return (0, xml_js_1.getTag)(this.property.toXML("scalar", padding1), "property", this.attributes, undefined, undefined, padding, true);
        }
        else {
            return (0, xml_js_1.getTag)(this.property.toXML("array", padding1), "property", this.attributes, undefined, undefined, padding, true);
        }
    }
}
exports.Property = Property;
/**
 * Represents the deltaEDown class.
 */
class DeltaEDown extends classes_js_1.NumberWithAttributes {
    /**
     * @param attributes The attributes.
     * @param units The units.
     */
    constructor(attributes, value) {
        super(attributes, value);
    }
}
exports.DeltaEDown = DeltaEDown;
/**
 * A class for representing an energy transfer model.
 */
class EnergyTransferModel extends classes_js_1.Attributes {
    /**
     * The DeltaEDown.
     */
    deltaEDown;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {DeltaEDown} deltaEDown The DeltaEDown.
     */
    constructor(attributes, deltaEDown) {
        super(attributes);
        this.deltaEDown = deltaEDown;
    }
    /**
     * @param padding - Optional padding string for formatting the XML output.
     * @returns An XML representation.
     */
    toXML(pad, padding) {
        if (pad == undefined) {
            return (0, xml_js_1.getTag)(this.deltaEDown.toXML("me.deltaEDown", padding), "me:energyTransferModel", this.attributes, undefined, undefined, padding, false);
        }
        else {
            return (0, xml_js_1.getTag)(this.deltaEDown.toXML("me.deltaEDown", padding), "energyTransferModel", undefined, undefined, undefined, padding, true);
        }
    }
}
exports.EnergyTransferModel = EnergyTransferModel;
/**
 * A class for representing a method for calculating the density of states.
 */
class DOSCMethod {
    type;
    constructor(type) {
        this.type = type;
    }
    /**
     * @returns A string representation.
     */
    toString() {
        return `DOSCMethod(type(${this.type}))`;
    }
    /**
     * @param padding The padding (Optional).
     * @returns A tag representation.
     */
    toTag(padding) {
        let s = `<me.DOSCMethod xsi:type="${this.type}"/>`;
        if (padding) {
            return "\n" + padding + s;
        }
        return "\n" + s;
    }
}
exports.DOSCMethod = DOSCMethod;
/**
 * A class for representing a molecule.
 * @param {string} id The id of the molecule.
 * @param {string} description The description of the molecule.
 * @param {boolean} active Indicates if the molecule is active.
 * @param {Map<string, Atom>} atoms A Map of atoms with keys as string atom ids and values as Atoms.
 * @param {Map<string, Bond>} bonds A Map of bonds with keys as string atom ids and values as Bonds.
 * @param {Map<string, Property>} properties A map of properties.
 * @param {EnergyTransferModel | null} energyTransferModel The energy transfer model.
 * @param {DOSCMethod | null} dOSCMethod The method for calculating density of states.
 */
class Molecule extends classes_js_1.Attributes {
    id;
    // Atoms
    atoms;
    // Bonds
    bonds;
    // Properties
    properties;
    // EnergyTransferModel
    energyTransferModel;
    // DOSCMethod
    dOSCMethod;
    /**
     * Create a molecule.
     * @param {Map<string, string>} attributes The attributes. If there is no "id" key an error will be thrown.
     * Additional attributes known about are "description" and "active", but these do not exist for all molecules
     * in Mesmer XML input/output files.
     * @param {Map<string, Atom>} atoms A Map of atoms with keys as ids.
     * @param {Map<string, Bond>} bonds A Map of bonds with. The keys combine the ids of the two bonded atoms.
     * @param {Map<string, Property>} properties A map of properties.
     * @param {EnergyTransferModel | null} energyTransferModel The energy transfer model.
     * @param {DOSCMethod | null} dOSCMethod The method for calculating density of states.
     */
    constructor(attributes, atoms, bonds, properties, energyTransferModel, dOSCMethod) {
        super(attributes);
        let id = this.attributes.get("id");
        if (id == undefined) {
            throw new Error('id is undefined');
        }
        this.id = id;
        this.atoms = atoms;
        this.bonds = bonds;
        this.properties = properties;
        this.energyTransferModel = energyTransferModel;
        this.dOSCMethod = dOSCMethod;
    }
    /**
     * @returns A string representation.
     */
    toString() {
        let r = `Molecule(id(${this.getID()}), `;
        let description = this.getDescription();
        if (description != undefined) {
            r += `description(${description}), `;
        }
        let active = this.getActive();
        if (active != undefined) {
            r += `active(${active}), `;
        }
        if (this.atoms.size > 0) {
            r += `atoms(${(0, functions_js_1.mapToString)(this.atoms)}), `;
        }
        if (this.bonds.size > 0) {
            r += `bonds(${(0, functions_js_1.mapToString)(this.bonds)}), `;
        }
        if (this.properties.size > 0) {
            r += `properties(${(0, functions_js_1.mapToString)(this.properties)}), `;
        }
        if (this.energyTransferModel) {
            r += `energyTransferModel(${this.energyTransferModel.toString()}), `;
        }
        if (this.dOSCMethod) {
            r += `dOSCMethod(${this.dOSCMethod.toString()}), `;
        }
        return r + `)`;
    }
    /**
     * @return The id of the molecule.
     */
    getID() {
        return this.attributes.get("id");
    }
    /**
     * Gets the description of the molecule.
     * @returns The description of the molecule, or undefined if it is not set.
     */
    getDescription() {
        return this.attributes.get("description");
    }
    /**
     * Gets the active status of the molecule.
     * @returns The active status of the molecule, or undefined if it is not set.
     */
    getActive() {
        let active = this.attributes.get("active");
        if (active != undefined) {
            return true;
        }
        return active;
    }
    /**
     * @returns {number} The energy of the molecule or zero if the energy is not set.
     * @throws An error if "me.ZPE" is a property, but is not mapped to a PropertyScalar.
     */
    getEnergy() {
        let zpe = this.properties.get('me:ZPE');
        if (zpe == undefined) {
            return 0;
        }
        if (zpe.property instanceof classes_js_1.NumberWithAttributes) {
            return zpe.property.value;
        }
        else {
            throw new Error("Expected a PropertyScalar but got a PropertyArray and not sure how to handle that.");
        }
    }
    /**
     * Set the Energy of the molecule.
     * @param {number} energy The energy of the molecule in kcal/mol.
     */
    setEnergy(energy) {
        let property = this.properties.get('me:ZPE');
        if (property == undefined) {
            throw new Error("No me.ZPE property found");
        }
        if (property.property instanceof classes_js_1.NumberArrayWithAttributes) {
            throw new Error("Expected a NumberWithAttributes but got a NumberArrayWithAttributes and not sure how to handle that.");
        }
        else {
            property.property.value = energy;
        }
    }
    /**
     * Get the RotationConstants of the molecule.
     * @returns The RotationConstants of the molecule.
     */
    getRotationConstants() {
        let property = this.properties.get('me:rotConsts');
        if (property != undefined) {
            if (property.property != null) {
                if (property.property instanceof classes_js_1.NumberWithAttributes) {
                    return [property.property.value];
                }
                else {
                    return property.property.values;
                }
            }
            else {
                return undefined;
            }
        }
        return property;
    }
    /**
     * Get the VibrationFrequencies of the molecule.
     * @returns The VibrationFrequencies of the molecule.
     */
    getVibrationFrequencies() {
        let property = this.properties.get('me:vibFreqs');
        if (property != undefined) {
            if (property.property instanceof classes_js_1.NumberWithAttributes) {
                return [property.property.value];
            }
            else if (property.property instanceof classes_js_1.NumberArrayWithAttributes) {
                return property.property.values;
            }
            else {
                return undefined;
            }
        }
        return property;
    }
    /**
     * @param {string} tagName The tag name.
     * @param {string} pad The pad (Optional).
     * @param {number} level The level of padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName, pad, level) {
        // Padding
        let padding0 = "";
        let padding1 = "";
        let padding2 = "";
        let padding3 = "";
        if (pad != undefined && level != undefined) {
            padding0 = pad.repeat(level);
            padding1 = padding0 + pad;
            padding2 = padding1 + pad;
            padding3 = padding2 + pad;
        }
        // Atoms
        let atoms_xml = "";
        for (let atom of this.atoms.values()) {
            atoms_xml += atom.toTag("atom", padding2);
        }
        if (this.atoms.size > 1) {
            if (atoms_xml != "") {
                atoms_xml = (0, xml_js_1.getTag)(atoms_xml, "atomArray", undefined, undefined, undefined, padding1, true);
            }
        }
        // Bonds
        let bonds_xml = "";
        for (let bond of this.bonds.values()) {
            bonds_xml += bond.toTag("bond", padding2);
        }
        if (bonds_xml != "") {
            bonds_xml = (0, xml_js_1.getTag)(bonds_xml, "bondArray", undefined, undefined, undefined, padding1, true);
        }
        // Properties
        let properties_xml = "";
        this.properties.forEach(property => {
            let property_xml = "";
            if (property.property instanceof classes_js_1.NumberWithAttributes) {
                property_xml += property.property.toXML("scalar", padding3);
            }
            else {
                property_xml += property.property.toXML("array", padding3);
            }
            properties_xml += (0, xml_js_1.getTag)(property_xml, "property", property.attributes, undefined, undefined, padding2, true);
        });
        if (this.properties.size > 1) {
            if (properties_xml != "") {
                properties_xml = (0, xml_js_1.getTag)(properties_xml, "propertyList", undefined, undefined, undefined, padding1, true);
            }
        }
        // EnergyTransferModel
        let energyTransferModel_xml = "";
        if (this.energyTransferModel) {
            energyTransferModel_xml = this.energyTransferModel.toXML(pad, padding1);
        }
        // DOSCMethod
        let dOSCMethod_xml = "";
        if (this.dOSCMethod) {
            dOSCMethod_xml = this.dOSCMethod.toTag(padding1);
        }
        return (0, xml_js_1.getTag)(atoms_xml + bonds_xml + properties_xml + energyTransferModel_xml + dOSCMethod_xml, tagName, this.attributes, undefined, undefined, padding0, true);
    }
}
exports.Molecule = Molecule;
//# sourceMappingURL=molecule.js.map