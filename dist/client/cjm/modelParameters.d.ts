import { NumberWithAttributes } from "./classes";
/**
 * A class for measures of grain size.
 */
export declare class GrainSize extends NumberWithAttributes {
    /**
     * @param {string} units The units.
     */
    constructor(attributes: Map<string, string>, value: number);
    toString(): string;
}
/**
 * A class for model parameters.
 */
export declare class ModelParameters {
    /**
     * The grain size.
     */
    grainSize: GrainSize;
    /**
     * The energy above the top hill.
     */
    energyAboveTheTopHill: number;
    /**
     * @param {GrainSize} grainSize The grain size.
     * @param {number} energyAboveTheTopHill The energy above the top hill.
     */
    constructor(grainSize: GrainSize, energyAboveTheTopHill: number);
    toString(): string;
    /**
     * Get the XML representation.
     * @param {string} pad The pad (Optional).
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(pad?: string, padding?: string): string;
}
