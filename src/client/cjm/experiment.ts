import { Measure } from "./molecule";


/**
 * A class for representing a Pressure and Temperature pair.
 * @param {string} units The units of the pair.
 * @param {number} P The pressure.
 * @param {number} T The temperature.
 */
export class PTpair {
    units: string;
    P: number;
    T: number;
    constructor(units: string, P: number, T: number) {
        this.units = units;
        this.P = P;
        this.T = T;
    }
    toString() {
        return `PTpair(` +
            `units(${this.units}), ` +
            `P(${this.P.toString()}), ` +
            `T(${this.T.toString()}))`;
    }
}

/**
 * A class for representing the experiment conditions.
 * @param {string} bathGas The bath gas.
 * @param {PTpair[]} pTs The Pressure and Temperature pairs.
 */
export class Conditions {
    bathGas: string;
    pTs: PTpair[];
    constructor(bathGas: string, pTs: PTpair[]) {
        this.bathGas = bathGas;
        this.pTs = pTs;
    }
    toString() {
        return `Conditions(` +
            `bathGas(${this.bathGas}), ` +
            `pTs(${this.pTs.toString()}))`;
    }
}

/**
 * A class for measures of grain size.
 * @param {number} value The value.
 * @param {string} units The units.
 */
export class GrainSize extends Measure {
    constructor(value: number, units: string) {
        super(value, units);
    }
    toString() {
        return `GrainSize(${super.toString()})`;
    }
}

/**
 * A class for model parameters.
 * @param {GrainSize} grainSize The grain size.
 * @param {number} energyAboveTheTopHill The energy above the top hill.
 */
export class ModelParameters {
    grainSize: GrainSize;
    energyAboveTheTopHill: number;
    constructor(grainSize: GrainSize, energyAboveTheTopHill: number) {
        this.grainSize = grainSize;
        this.energyAboveTheTopHill = energyAboveTheTopHill;
    }
    toString() {
        return `ModelParameters(` +
            `grainSize(${this.grainSize.toString()}), ` +
            `energyAboveTheTopHill(${this.energyAboveTheTopHill.toString()}))`;
    }
}

/**
 * A class for the diagram energy offset.
 * @param {string} ref The reference.
 * @param {number} value The value.
 */
export class DiagramEnergyOffset {
    ref: string;
    value: number;
    constructor(ref: string, value: number) {
        this.ref = ref;
        this.value = value;
    }
    toString() {
        return `DiagramEnergyOffset(` +
            `ref(${this.ref}), ` +
            `value(${this.value.toString()}))`;
    }
}

/**
 * A class for the control.
 * @param {boolean} testDOS The test density of states flag.
 * @param {boolean} printSpeciesProfile The print species profile flag.
 * @param {boolean} testMicroRates The test micro rates flag.
 * @param {boolean} testRateConstant The test rate constant flag.
 * @param {boolean} printGrainDOS The print grain density of states flag.
 * @param {boolean} printCellDOS The print cell density of states flag.
 * @param {boolean} printReactionOperatorColumnSums The print reaction operator column sums flag.
 * @param {boolean} printTunnellingCoefficients The print tunnelling coefficients flag.
 * @param {boolean} printGrainkfE The print grain kfE flag.
 * @param {boolean} printGrainBoltzmann The print grain Boltzmann flag.
 * @param {boolean} printGrainkbE The print grain kbE flag.
 * @param {number} eigenvalues The number of eigenvalues.
 * @param {boolean} hideInactive The hide inactive flag.
 * @param {DiagramEnergyOffset} diagramEnergyOffset The diagram energy offset.
 */
export class Control {
    testDOS: boolean;
    printSpeciesProfile: boolean;
    testMicroRates: boolean;
    testRateConstant: boolean;
    printGrainDOS: boolean;
    printCellDOS: boolean;
    printReactionOperatorColumnSums: boolean;
    printTunnellingCoefficients: boolean;
    printGrainkfE: boolean;
    printGrainBoltzmann: boolean;
    printGrainkbE: boolean;
    eigenvalues: number;
    hideInactive: boolean;
    diagramEnergyOffset: DiagramEnergyOffset;
    constructor(testDOS: boolean, printSpeciesProfile: boolean, testMicroRates: boolean, testRateConstant:
        boolean, printGrainDOS: boolean, printCellDOS: boolean, printReactionOperatorColumnSums:
            boolean, printTunnellingCoefficients: boolean, printGrainkfE: boolean, printGrainBoltzmann: boolean,
        printGrainkbE: boolean, eigenvalues: number, hideInactive: boolean, diagramEnergyOffset: DiagramEnergyOffset) {
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
            `testDOS(${this.testDOS.toString()}), ` +
            `printSpeciesProfile(${this.printSpeciesProfile.toString()}), ` +
            `testMicroRates(${this.testMicroRates.toString()}), ` +
            `testRateConstant(${this.testRateConstant.toString()}), ` +
            `printGrainDOS(${this.printGrainDOS.toString()}), ` +
            `printCellDOS(${this.printCellDOS.toString()}), ` +
            `printReactionOperatorColumnSums(${this.printReactionOperatorColumnSums.toString()}), ` +
            `printTunnellingCoefficients(${this.printTunnellingCoefficients.toString()}), ` +
            `printGrainkfE(${this.printGrainkfE.toString()}), ` +
            `printGrainBoltzmann(${this.printGrainBoltzmann.toString()}), ` +
            `printGrainkbE(${this.printGrainkbE.toString()}), ` +
            `eigenvalues(${this.eigenvalues.toString()}), ` +
            `hideInactive(${this.hideInactive.toString()}))`;
    }
}