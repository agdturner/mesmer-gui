import { Attributes } from "./classes.js";
import { ReactionMolecule } from "./reaction.js";
import { getTag } from "./xml.js";
/**
 * A class for representing a Pressure and Temperature pair.
 */
export class PTpair extends Attributes {
    /**
     * The pressure also stored as a string in the attributes.
     */
    P;
    /**
     * The temperature also stored as a string in the attributes.
     */
    T;
    /**
     * @param {Map<string, string>} attributes The attributes.
     */
    constructor(attributes) {
        super(attributes);
        let p = attributes.get("P");
        if (p) {
            this.P = parseFloat(p);
        }
        else {
            throw new Error("P is undefined");
        }
        let t = attributes.get("T");
        if (t) {
            this.T = parseFloat(t);
        }
        else {
            throw new Error("T is undefined");
        }
    }
}
/**
 * A class for representing a bath gas reaction molecule.
 */
export class BathGas extends ReactionMolecule {
    constructor(attributes, molecule) {
        super(attributes, molecule);
    }
}
/**
 * A class for representing the experiment conditions.
 */
export class Conditions {
    /**
     * The bath gas.
     */
    bathGas;
    /**
     * The Pressure and Temperature pair.
     */
    pTs;
    /**
     * @param {BathGas} bathGas The bath gas.
     * @param {PTpair} pTs The Pressure and Temperature pairs.
     */
    constructor(bathGas, pTs) {
        this.bathGas = bathGas;
        this.pTs = pTs;
    }
    /**
     * @returns A string representation.
     */
    toString() {
        return `Conditions(` +
            `bathGas(${this.bathGas.toString()}), ` +
            `pTs(${this.pTs.toString()}))`;
    }
    /**
     * @param padding The padding (optional).
     * @returns An XML representation.
     */
    toXML(pad, padding) {
        let padding1 = "";
        if (pad != undefined && padding != undefined) {
            padding1 = padding + pad;
        }
        let s = this.bathGas.toXML("bathGas", pad, padding1);
        this.pTs.forEach((pt) => {
            s += pt.toTag("PTpair", padding1);
        });
        return getTag(s, "conditions", undefined, undefined, undefined, padding, true);
    }
}
//# sourceMappingURL=conditions.js.map