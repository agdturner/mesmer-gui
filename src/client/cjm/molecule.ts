import {
    arrayToString, mapToString
} from './functions.js';

import {
    getTag
} from './xml.js';

/**
 * A class for representing an atom.
 * @param {string} id The id of the atom.
 * @param {string} elementType The element type of the atom.
 */
export class Atom {
    id: string;
    elementType: string;
    constructor(id: string, elementType: string) {
        this.id = id;
        this.elementType = elementType;
    }

    /**
     * Convert the atom to a string.
     * @returns The string representation of the atom.
     */
    toString(): string {
        return `Atom(id(${this.id}), elementType(${this.elementType}))`;
    }

    /**
     * Get the tag representation of the atom.
     * @param pad The padding (Optional).
     * @returns A tag representation of the atom.
     */
    toTag(pad?: string): string {
        let s: string = `<atom id="${this.id}" elementType="${this.elementType}"/>`;
        if (pad) {
            return "\n" + pad + s;
        }
        return "\n" + s;
    }

    /**
     * Get the XML representation of the atom.
     * @param padding The padding (Optional).
     * @returns An XML representation of the atom.
     */
    toXML(padding?: string): string {
        // Attributes
        let attributes: Map<string, string> = new Map();
        attributes.set("id", this.id);
        attributes.set("elementType", this.elementType);
        return getTag("", "atom", attributes, undefined, undefined, padding, false);
    }
}

/**
 * A class for representing an atomic bond - a bond beteen two atoms.
 * @param {Atom} atomA One atom.
 * @param {Atom} atomB Another atom.
 * @param {string} order The order of the bond.
 */
export class Bond {
    atomA: Atom;
    atomB: Atom;
    order: string;
    constructor(atomA: Atom, atomB: Atom, order: string) {
        this.atomA = atomA;
        this.atomB = atomB;
        this.order = order;
    }

    /**
     * Convert the bond to a string.
     * @returns The string representation of the bond.
     */
    toString(): string {
        return `Bond(` +
            `atomA(${this.atomA.toString()}), ` +
            `atomB(${this.atomA.toString()}), ` +
            `order(${this.order}))`;
    }

    /**
     * Get the tag representation of the bond.
     * @param pad The padding (Optional).
     * @returns A tag representation of the atom.
     */
    toTag(pad?: string): string {
        let s: string = `<bond atomRefs2="${this.atomA.id} ${this.atomB.id}" order="${this.order}"/>`;
        if (pad) {
            return "\n" + pad + s;
        }
        return "\n" + s;
    }

    /**
     * Get the XML representation of the bond.
     * @param padding The padding (Optional).
     * @returns An XML representation of the bond.
     */
    toXML(padding?: string): string {
        // Attributes
        let attributes: Map<string, string> = new Map();
        attributes.set("atomRefs2", this.atomA.id + " " + this.atomB.id);
        attributes.set("order", this.order);
        return getTag("", "bond", attributes, undefined, undefined, padding, false);
    }
}

/**
 * A class for representing a measure.
 * @param {number} value The value of the measure.
 * @param {string | null} units The units of the measure.
 */
export class Measure {
    value: number;
    units: string | null;
    constructor(value: number, units: string | null) {
        this.value = value;
        this.units = units;
    }

    /**
     * @returns A string representation.
     */
    toString(): string {
        return `Measure(value(${this.value.toString()}), ` +
            `units(${this.units ? this.units : 'null'}))`;
    }
}

/**
 * A class for representing a property scalar.
 * @param {number} value The value.
 * @param {string} units The units.
 */
export class PropertyScalar extends Measure {
    constructor(value: number, units: string) {
        super(value, units);
    }

    /**
     * @returns A string representation.
     */
    toString(): string {
        return `Scalar(${super.toString()})`;
    }

    /**
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(padding?: string): string {
        if (this.units == null) {
            return getTag(this.value.toString().trim(), "scalar", undefined, undefined, undefined, padding, false);
        }
        return getTag(this.value.toString().trim(), "scalar", undefined, "units", this.units, padding, false);
    }
}

/**
 * A class for representing a property array.
 * @param {number[]} values The values.
 * @param {string} unit The unit.
 */
export class PropertyArray {
    values: number[];
    units: string;
    constructor(values: number[], units: string) {
        this.values = values;
        this.units = units;
    }

    /**
     * @returns A string representation.
     */
    toString(): string {
        return `PropertyArray(` +
            `values(${arrayToString(this.values)}), ` +
            `unit(${this.units}))`;
    }

    /**
     * @param padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(padding?: string): string {
        let valuesString: string = this.values.toString().trim().replaceAll(",", " ");
        if (this.units == null) {
            return getTag(valuesString, "array", undefined, undefined, undefined, padding, false);
        }
        return getTag(valuesString, "array", undefined, "units", this.units, padding, false);
    }

    /**
     * Convert to a PropertyScalar array.
     * @returns The PropertyScalar array.
     */
    toPropertyScalarArray(): PropertyScalar[] {
        let r: PropertyScalar[] = [];
        for (let i = 0; i < this.values.length; i++) {
            r.push(new PropertyScalar(this.values[i], this.units));
        }
        return r;
    }
}


/**
 * Represents the deltaEDown class.
 * @extends Measure
 * @param {number} value The value.
 * @param {string} units The units.
 */
export class DeltaEDown extends Measure {
    constructor(value: number, units: string) {
        super(value, units);
    }

    /**
     * @returns A string representation.
     */
    override toString(): string {
        return `deltaEDown(${super.toString()})`;
    }

    /**
     * @param padding - Optional padding string.
     * @returns An XML representation.
     */
    toXML(padding?: string): string {
        return getTag(this.value.toString().trim(), "me.deltaEDown", undefined, "units", this.units, padding, false);
    }
}

export class EnergyTransferModel {
    type: string;
    deltaEDown: DeltaEDown;
    constructor(type: string, deltaEDown: DeltaEDown) {
        this.type = type;
        this.deltaEDown = deltaEDown;
    }

    /**
     * @param padding - Optional padding string for formatting the XML output.
     * @returns An XML representation.
     */
    toXML(pad?: string, padding?: string): string {
        if (pad == undefined) {
            return getTag(this.deltaEDown.toXML(), "energyTransferModel", undefined, "xsi:type",
                this.type, padding, true);
        } else {
            return getTag(this.deltaEDown.toXML(padding + pad), "energyTransferModel", undefined,
                "xsi:type", this.type, padding, true);
        }
    }
}

/**
 * A class for representing a method for calculating the density of states.
 */
export class DOSCMethod {
    type: string;
    constructor(type: string) {
        this.type = type;
    }
    
    /**
     * @returns A string representation.
     */
    toString(): string {
        return `DOSCMethod(type(${this.type}))`;
    }

    /**
     * @param padding The padding (Optional).
     * @returns A tag representation.
     */
    toTag(padding?: string): string {
        let s: string = `<me.DOSCMethod xsi:type="${this.type}"/>`;
        if (padding) {
            return "\n" + padding + s;
        }
        return "\n" + s;
    }
}

/**
 * A class for representing a molecule.
 * @param {string} id The id of the molecule.
 * @param {string} description The description of the molecule.
 * @param {boolean} active Indicates if the molecule is active.
 * @param {Map<string, Atom>} atoms A Map of atoms with keys as string atom ids and values as Atoms.
 * @param {Map<string, Bond>} bonds A Map of bonds with keys as string atom ids and values as Bonds.
 * @param {Map<string, PropertyScalar | PropertyArray>} properties A map of properties.
 * @param {EnergyTransferModel | null} energyTransferModel The energy transfer model.
 * @param {DOSCMethod | null} dOSCMethod The method for calculating density of states.
 */
export class Molecule {
    id: string;
    description: string | null;
    active: boolean;
    atoms: Map<string, Atom>;
    bonds: Map<string, Bond>;
    properties: Map<string, PropertyScalar | PropertyArray>;
    energyTransferModel?: EnergyTransferModel;
    dOSCMethod?: DOSCMethod;
    constructor(id: string, description: string | null, active: boolean,
        atoms: Map<string, Atom>,
        bonds: Map<string, Bond>,
        properties: Map<string, PropertyScalar | PropertyArray>,
        energyTransferModel?: EnergyTransferModel,
        dOSCMethod?: DOSCMethod) {
        this.id = id;
        this.description = description;
        this.active = active;
        this.atoms = atoms;
        this.bonds = bonds;
        this.properties = properties;
        this.energyTransferModel = energyTransferModel;
        this.dOSCMethod = dOSCMethod;
    }

    /** 
     * @returns A string representation.
     */
    toString(): string {
        return `Molecule(` +
            `id(${this.id}), ` +
            `description(${this.description}), ` +
            `active(${this.active.toString()}), ` +
            `atoms(${mapToString(this.atoms)}), ` +
            `bonds(${mapToString(this.bonds)}), ` +
            `properties(${mapToString(this.properties)}), ` +
            `energyTransferModel(${this.energyTransferModel ? this.energyTransferModel.toString() : 'null'}), ` +
            `dOSCMethod(${this.dOSCMethod ? this.dOSCMethod : 'null'}))`;
    }

    /**
     * @returns The energy of the molecule.
     */
    getEnergy(): number {
        let zpe = this.properties.get('me:ZPE');
        if (zpe instanceof PropertyScalar) {
            return zpe.value;
        } else {
            return 0;
        }
    }

    /**
     * Set the Energy of the molecule.
     * @param {number} energy The energy of the molecule.
     */
    setEnergy(energy: number) {
        this.properties.set('me:ZPE', new PropertyScalar(energy, 'kcal/mol'));
    }

    /**
     * Get the RotationConstants of the molecule.
     * @returns The RotationConstants of the molecule.
     */
    getRotationConstants(): number[] | undefined {
        let rotConsts: PropertyScalar | PropertyArray | undefined = this.properties.get('me:rotConsts');
        if (rotConsts != undefined) {
            if (rotConsts instanceof PropertyScalar) {
                return [rotConsts.value];
            } else {
                return rotConsts.values;
            }
        }
        return rotConsts;
    }

    /**
     * Get the VibrationFrequencies of the molecule.
     * @returns The VibrationFrequencies of the molecule.
     */
    getVibrationFrequencies(): number[] | undefined {
        let vibFreqs: PropertyScalar | PropertyArray | undefined = this.properties.get('me:vibFreqs');
        if (vibFreqs != undefined) {
            if (vibFreqs instanceof PropertyScalar) {
                return [vibFreqs.value];
            } else {
                return vibFreqs.values;
            }
        }
        return vibFreqs;
    }

    /**
     * @param {string} pad The pad (Optional).
     * @param {number} level The level of padding (Optional).
     * @returns An XML representation.
     */
    toXML(pad?: string, level?: number): string {
        // Padding
        let padding0: string = "";
        let padding1: string = "";
        let padding2: string = "";
        let padding3: string = "";
        if (pad != undefined && level != undefined) {
            padding0 = pad.repeat(level);
            padding1 = padding0 + pad;
            padding2 = padding1 + pad;
            padding3 = padding2 + pad;
        }
        // Atoms
        let atoms_xml: string = "";
        for (let atom of this.atoms.values()) {
            atoms_xml += atom.toTag(padding2);
        }
        if (this.atoms.size > 1) {
            if (atoms_xml != "") {
                atoms_xml = getTag(atoms_xml, "atomArray", undefined, undefined, undefined, padding1, true);
            }
        }
        // Bonds
        let bonds_xml: string = "";
        for (let bond of this.bonds.values()) {
            bonds_xml += bond.toTag(padding2);
        }
        if (bonds_xml != "") {
            bonds_xml = getTag(bonds_xml, "bondArray", undefined, undefined, undefined, padding1, true);
        }
        // Properties
        let properties_xml: string = "";
        for (let [key, value] of this.properties) {
            let property_xml: string = "";
            if (value instanceof PropertyScalar) {
                property_xml += value.toXML(padding3);
            } else {
                property_xml += (value as PropertyArray).toXML(padding3);
            }
            properties_xml += getTag(property_xml, "property", undefined, undefined, undefined, padding2, true);
        }        
        if (this.properties.size > 1) {
            if (properties_xml != "") {
                properties_xml = getTag(properties_xml, "propertyList", undefined, undefined, undefined, padding1, true);
            }
        }
        // EnergyTransferModel
        let energyTransferModel_xml: string = "";
        if (this.energyTransferModel) {
            energyTransferModel_xml = this.energyTransferModel.toXML(pad, padding1);
        }
        // DOSCMethod
        let dOSCMethod_xml: string = "";
        if (this.dOSCMethod) {
            dOSCMethod_xml = this.dOSCMethod.toTag(padding1);
        }
        // Molecule
        let attributes: Map<string, string> = new Map();
        attributes.set("id", this.id);
        if (this.description != null) {
            attributes.set("description", this.description);
        }
        return getTag(atoms_xml + bonds_xml + properties_xml + energyTransferModel_xml + dOSCMethod_xml,
            "molecule", attributes, undefined, undefined, padding0, true);
    }
}