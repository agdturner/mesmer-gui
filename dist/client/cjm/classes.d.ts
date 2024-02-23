/**
 * A class for representing things with attributes.
 * @param {Map<string, string>} attributes The attributes.
 */
export declare abstract class Attributes {
    /**
     * The attributes.
     */
    attributes: Map<string, string>;
    /**
     * @param attributes The attributes.
     */
    constructor(attributes: Map<string, string>);
    /**
     * @returns The name in lower case.
     */
    /**
     * @returns A string representation.
     */
    toString(): string;
    /**
     * Get the tag representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns A tag representation.
     */
    toTag(tagName: string, padding?: string): string;
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName: string, padding?: string): string;
}
/**
 * A class for representing a number with attributes.
 * e.g. A value with units and measurement/uncertainty information.
 */
export declare class NumberWithAttributes extends Attributes {
    value: number;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value.
     */
    constructor(attributes: Map<string, string>, value: number);
    /**
     * @returns A string representation.
     */
    toString(): string;
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName: string, padding?: string): string;
}
/**
 * A class for representing numerical values with a shared attributes.
 * e.g. An array values sharing the same units and measurement details.
 */
export declare class NumberArrayWithAttributes extends Attributes {
    /**
     * The values.
     */
    values: number[];
    /**
     * The delimiter of the values.
     */
    delimiter: string;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number[]} values The values.
     * @param {string} delimiter The delimiter of the values (Optional - default will be ",").
     */
    constructor(attributes: Map<string, string>, values: number[], delimiter?: string);
    /**
     * @returns A string representation.
     */
    toString(): string;
    /**
     * Set the delimiter.
     * @param {string} delimiter The delimiter.
     */
    setDelimiter(delimiter: string): void;
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName: string, padding?: string): string;
}
