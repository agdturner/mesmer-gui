"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Control = exports.DiagramEnergyOffset = void 0;
const classes_1 = require("./classes");
const html_1 = require("./html");
const xml_1 = require("./xml");
/**
 * A class for the diagram energy offset.
 */
class DiagramEnergyOffset extends classes_1.NumberWithAttributes {
    /**
     * @param {Map<string, string>} attributes The attributes (ref refers to a particular reaction).
     * @param {number} value The value.
     */
    constructor(attributes, value) {
        super(attributes, value);
    }
}
exports.DiagramEnergyOffset = DiagramEnergyOffset;
/**
 * A class for the control.
 */
class Control {
    testDOS;
    printSpeciesProfile;
    testMicroRates;
    testRateConstant;
    printGrainDOS;
    printCellDOS;
    printReactionOperatorColumnSums;
    printTunnellingCoefficients;
    printGrainkfE;
    printGrainBoltzmann;
    printGrainkbE;
    eigenvalues;
    hideInactive;
    diagramEnergyOffset;
    constructor(testDOS, printSpeciesProfile, testMicroRates, testRateConstant, printGrainDOS, printCellDOS, printReactionOperatorColumnSums, printTunnellingCoefficients, printGrainkfE, printGrainBoltzmann, printGrainkbE, eigenvalues, hideInactive, diagramEnergyOffset) {
        this.testDOS = testDOS;
        this.printSpeciesProfile = printSpeciesProfile;
        this.testMicroRates = testMicroRates;
        this.testRateConstant = testRateConstant;
        this.printGrainDOS = printGrainDOS;
        this.printCellDOS = printCellDOS;
        this.printReactionOperatorColumnSums = printReactionOperatorColumnSums;
        this.printTunnellingCoefficients = printTunnellingCoefficients;
        this.printGrainkfE = printGrainkfE;
        this.printGrainBoltzmann = printGrainBoltzmann;
        this.printGrainkbE = printGrainkbE;
        this.eigenvalues = eigenvalues;
        this.hideInactive = hideInactive;
        this.diagramEnergyOffset = diagramEnergyOffset;
    }
    toString() {
        return `Control(` +
            `testDOS(${this.testDOS?.toString()}), ` +
            `printSpeciesProfile(${this.printSpeciesProfile?.toString()}), ` +
            `testMicroRates(${this.testMicroRates?.toString()}), ` +
            `testRateConstant(${this.testRateConstant?.toString()}), ` +
            `printGrainDOS(${this.printGrainDOS?.toString()}), ` +
            `printCellDOS(${this.printCellDOS?.toString()}), ` +
            `printReactionOperatorColumnSums(${this.printReactionOperatorColumnSums?.toString()}), ` +
            `printTunnellingCoefficients(${this.printTunnellingCoefficients?.toString()}), ` +
            `printGrainkfE(${this.printGrainkfE?.toString()}), ` +
            `printGrainBoltzmann(${this.printGrainBoltzmann?.toString()}), ` +
            `printGrainkbE(${this.printGrainkbE?.toString()}), ` +
            `eigenvalues(${this.eigenvalues?.toString()}), ` +
            `hideInactive(${this.hideInactive?.toString()}))`;
    }
    /**
     * Get the XML representation.
     * @param {string} pad The pad (Optional).
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(pad, padding) {
        let padding1 = "";
        if (pad != undefined && padding != undefined) {
            padding1 = padding + pad;
        }
        let s = "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:testDOS") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printSpeciesProfile") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:testMicroRates") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:testRateConstant") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printGrainDOS") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printCellDOS") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printReactionOperatorColumnSums") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printTunnellingCoefficients") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printGrainkfE") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printGrainBoltzmann") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:printGrainkbE") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:eigenvalues") + "\n";
        s += padding1 + (0, html_1.getSelfClosingTag)(null, "me:hideInactive");
        s += this.diagramEnergyOffset?.toXML("me:diagramEnergyOffset", padding1);
        return (0, xml_1.getTag)(s, "control", undefined, undefined, null, padding, true);
    }
}
exports.Control = Control;
//# sourceMappingURL=control.js.map