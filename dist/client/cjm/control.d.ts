import { NumberWithAttributes } from "./classes";
/**
 * A class for the diagram energy offset.
 */
export declare class DiagramEnergyOffset extends NumberWithAttributes {
    /**
     * @param {Map<string, string>} attributes The attributes (ref refers to a particular reaction).
     * @param {number} value The value.
     */
    constructor(attributes: Map<string, string>, value: number);
}
/**
 * A class for the control.
 */
export declare class Control {
    testDOS: boolean | undefined;
    printSpeciesProfile: boolean | undefined;
    testMicroRates: boolean | undefined;
    testRateConstant: boolean | undefined;
    printGrainDOS: boolean | undefined;
    printCellDOS: boolean | undefined;
    printReactionOperatorColumnSums: boolean | undefined;
    printTunnellingCoefficients: boolean | undefined;
    printGrainkfE: boolean | undefined;
    printGrainBoltzmann: boolean | undefined;
    printGrainkbE: boolean | undefined;
    eigenvalues: number | undefined;
    hideInactive: boolean | undefined;
    diagramEnergyOffset: DiagramEnergyOffset | undefined;
    constructor(testDOS?: boolean, printSpeciesProfile?: boolean, testMicroRates?: boolean, testRateConstant?: boolean, printGrainDOS?: boolean, printCellDOS?: boolean, printReactionOperatorColumnSums?: boolean, printTunnellingCoefficients?: boolean, printGrainkfE?: boolean, printGrainBoltzmann?: boolean, printGrainkbE?: boolean, eigenvalues?: number, hideInactive?: boolean, diagramEnergyOffset?: DiagramEnergyOffset);
    toString(): string;
    /**
     * Get the XML representation.
     * @param {string} pad The pad (Optional).
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(pad: string, padding?: string): string;
}
