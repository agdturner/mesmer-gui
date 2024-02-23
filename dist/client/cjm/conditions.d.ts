import { Attributes } from "./classes.js";
import { Molecule } from "./molecule.js";
import { ReactionMolecule } from "./reaction.js";
/**
 * A class for representing a Pressure and Temperature pair.
 */
export declare class PTpair extends Attributes {
    /**
     * The pressure also stored as a string in the attributes.
     */
    P: number;
    /**
     * The temperature also stored as a string in the attributes.
     */
    T: number;
    /**
     * @param {Map<string, string>} attributes The attributes.
     */
    constructor(attributes: Map<string, string>);
}
/**
 * A class for representing a bath gas reaction molecule.
 */
export declare class BathGas extends ReactionMolecule {
    constructor(attributes: Map<string, string>, molecule: Molecule);
}
/**
 * A class for representing the experiment conditions.
 */
export declare class Conditions {
    /**
     * The bath gas.
     */
    bathGas: BathGas;
    /**
     * The Pressure and Temperature pair.
     */
    pTs: PTpair[];
    /**
     * @param {BathGas} bathGas The bath gas.
     * @param {PTpair} pTs The Pressure and Temperature pairs.
     */
    constructor(bathGas: BathGas, pTs: PTpair[]);
    /**
     * @returns A string representation.
     */
    toString(): string;
    /**
     * @param padding The padding (optional).
     * @returns An XML representation.
     */
    toXML(pad?: string, padding?: string): string;
}
