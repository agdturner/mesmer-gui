"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conditions = exports.BathGas = exports.PTpair = void 0;
const classes_js_1 = require("./classes.js");
const reaction_js_1 = require("./reaction.js");
const xml_js_1 = require("./xml.js");
/**
 * A class for representing a Pressure and Temperature pair.
 */
class PTpair extends classes_js_1.Attributes {
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
exports.PTpair = PTpair;
/**
 * A class for representing a bath gas reaction molecule.
 */
class BathGas extends reaction_js_1.ReactionMolecule {
    constructor(attributes, molecule) {
        super(attributes, molecule);
    }
}
exports.BathGas = BathGas;
/**
 * A class for representing the experiment conditions.
 */
class Conditions {
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
        return (0, xml_js_1.getTag)(s, "conditions", undefined, undefined, undefined, padding, true);
    }
}
exports.Conditions = Conditions;
//# sourceMappingURL=conditions.js.map