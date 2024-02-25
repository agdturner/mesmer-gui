"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelParameters = exports.GrainSize = void 0;
const classes_1 = require("./classes");
const xml_1 = require("./xml");
/**
 * A class for measures of grain size.
 */
class GrainSize extends classes_1.NumberWithAttributes {
    /**
     * @param {string} units The units.
     */
    constructor(attributes, value) {
        super(attributes, value);
    }
    toString() {
        return `GrainSize(${super.toString()})`;
    }
}
exports.GrainSize = GrainSize;
/**
 * A class for model parameters.
 */
class ModelParameters {
    /**
     * The grain size.
     */
    grainSize;
    /**
     * The energy above the top hill.
     */
    energyAboveTheTopHill;
    /**
     * @param {GrainSize} grainSize The grain size.
     * @param {number} energyAboveTheTopHill The energy above the top hill.
     */
    constructor(grainSize, energyAboveTheTopHill) {
        this.grainSize = grainSize;
        this.energyAboveTheTopHill = energyAboveTheTopHill;
    }
    toString() {
        return `ModelParameters(` +
            `grainSize(${this.grainSize.toString()}), ` +
            `energyAboveTheTopHill(${this.energyAboveTheTopHill.toString()}))`;
    }
    /**
     * Get the XML representation.
     * @param {string} pad The pad (Optional).
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(pad, padding) {
        let padding2 = "";
        if (pad != undefined && padding != undefined) {
            padding2 = padding + pad;
        }
        let s = this.grainSize.toXML("me:GrainSize", padding2);
        s += (0, xml_1.getTag)(this.energyAboveTheTopHill.toString(), "me:EnergyAboveTheTopHill", undefined, undefined, undefined, padding2, false);
        return (0, xml_1.getTag)(s, "me:modelParameters", undefined, undefined, undefined, padding, true);
    }
}
exports.ModelParameters = ModelParameters;
//# sourceMappingURL=modelParameters.js.map