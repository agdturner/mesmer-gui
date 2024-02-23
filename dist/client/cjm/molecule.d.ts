import { Attributes, NumberArrayWithAttributes, NumberWithAttributes } from './classes.js';
/**
 * A class for representing an atom.
 * @param {Map<string, string>} attributes The attributes.
 * If there is no "id" or "elementType" key an error will be thrown.
 */
export declare class Atom extends Attributes {
    /**
     * @param attributes The attributes. If there is no "id" or "elementType" key an error will be thrown.
     */
    constructor(attributes: Map<string, string>);
    /**
     * @returns A string representation.
     */
    toString(): string;
    /**
     * @returns The id of the atom.
     */
    get id(): string;
    /**
     * @returns The element type of the atom.
     */
    get elementType(): string;
}
/**
 * A class for representing an atomic bond - a bond beteen two atoms.
 * @param {Map<string, string>} attributes The attributes.
 * @param {Atom} atomA One atom.
 * @param {Atom} atomB Another atom.
 * @param {string} order The order of the bond.
 */
export declare class Bond extends Attributes {
    /**
     * @param {Map<string, string>} attributes The attributes.
     */
    constructor(attributes: Map<string, string>);
    /**
     * @returns A string representation.
     */
    toString(): string;
}
/**
 * A class for representing a property.
 */
export declare class Property extends Attributes {
    /**
     * The property value.
     */
    property: NumberWithAttributes | NumberArrayWithAttributes;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {NumberWithAttributes | NumberArrayWithAttributes} property The property.
     */
    constructor(attributes: Map<string, string>, property: NumberWithAttributes | NumberArrayWithAttributes);
    /**
     * @returns A string representation.
     */
    toString(): string;
    /**
     * @param padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(pad?: string, padding?: string): string;
}
/**
 * Represents the deltaEDown class.
 */
export declare class DeltaEDown extends NumberWithAttributes {
    /**
     * @param attributes The attributes.
     * @param units The units.
     */
    constructor(attributes: Map<string, string>, value: number);
}
/**
 * A class for representing an energy transfer model.
 */
export declare class EnergyTransferModel extends Attributes {
    /**
     * The DeltaEDown.
     */
    deltaEDown: DeltaEDown;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {DeltaEDown} deltaEDown The DeltaEDown.
     */
    constructor(attributes: Map<string, string>, deltaEDown: DeltaEDown);
    /**
     * @param padding - Optional padding string for formatting the XML output.
     * @returns An XML representation.
     */
    toXML(pad?: string, padding?: string): string;
}
/**
 * A class for representing a method for calculating the density of states.
 */
export declare class DOSCMethod {
    type: string;
    constructor(type: string);
    /**
     * @returns A string representation.
     */
    toString(): string;
    /**
     * @param padding The padding (Optional).
     * @returns A tag representation.
     */
    toTag(padding?: string): string;
}
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
export declare class Molecule extends Attributes {
    id: string;
    atoms: Map<string, Atom>;
    bonds: Map<string, Bond>;
    properties: Map<string, Property>;
    energyTransferModel?: EnergyTransferModel;
    dOSCMethod?: DOSCMethod;
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
    constructor(attributes: Map<string, string>, atoms: Map<string, Atom>, bonds: Map<string, Bond>, properties: Map<string, Property>, energyTransferModel?: EnergyTransferModel, dOSCMethod?: DOSCMethod);
    /**
     * @returns A string representation.
     */
    toString(): string;
    /**
     * @return The id of the molecule.
     */
    getID(): string;
    /**
     * Gets the description of the molecule.
     * @returns The description of the molecule, or undefined if it is not set.
     */
    getDescription(): string | undefined;
    /**
     * Gets the active status of the molecule.
     * @returns The active status of the molecule, or undefined if it is not set.
     */
    getActive(): boolean | undefined;
    /**
     * @returns {number} The energy of the molecule or zero if the energy is not set.
     * @throws An error if "me.ZPE" is a property, but is not mapped to a PropertyScalar.
     */
    getEnergy(): number;
    /**
     * Set the Energy of the molecule.
     * @param {number} energy The energy of the molecule in kcal/mol.
     */
    setEnergy(energy: number): void;
    /**
     * Get the RotationConstants of the molecule.
     * @returns The RotationConstants of the molecule.
     */
    getRotationConstants(): number[] | undefined;
    /**
     * Get the VibrationFrequencies of the molecule.
     * @returns The VibrationFrequencies of the molecule.
     */
    getVibrationFrequencies(): number[] | undefined;
    /**
     * @param {string} tagName The tag name.
     * @param {string} pad The pad (Optional).
     * @param {number} level The level of padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName: string, pad?: string, level?: number): string;
}
