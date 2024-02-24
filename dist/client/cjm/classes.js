import { getSelfClosingTag } from "./html";
import { getTag } from "./xml";
/**
 * A class for representing things with attributes.
 * @param {Map<string, string>} attributes The attributes.
 */
export class Attributes {
    /**
     * The attributes.
     */
    attributes;
    /**
     * @param attributes The attributes.
     */
    constructor(attributes) {
        this.attributes = attributes;
    }
    /**
     * @returns The name in lower case.
     */
    /*
    get name(): string {
        return this.constructor.name.toLowerCase().trim();
    }
    */
    /**
     * @returns A string representation.
     */
    toString() {
        let r = this.constructor.name + `(`;
        this.attributes.forEach((value, key) => {
            r += `${key}(${value}), `;
        });
        return r;
    }
    /**
     * Get the tag representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns A tag representation.
     */
    toTag(tagName, padding) {
        let s = getSelfClosingTag(this.attributes, tagName);
        if (padding) {
            return "\n" + padding + s;
        }
        return "\n" + s;
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName, padding) {
        return getTag("", tagName, this.attributes, undefined, undefined, padding, false);
    }
}
/**
 * A class for representing a number with attributes.
 * e.g. A value with units and measurement/uncertainty information.
 */
export class NumberWithAttributes extends Attributes {
    value;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value.
     */
    constructor(attributes, value) {
        super(attributes);
        this.value = value;
    }
    /**
     * @returns A string representation.
     */
    toString() {
        return super.toString() + `, ${this.value.toString()})`;
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName, padding) {
        return getTag(this.value.toString().trim(), tagName, this.attributes, undefined, undefined, padding, false);
    }
}
/**
 * A class for representing numerical values with a shared attributes.
 * e.g. An array values sharing the same units and measurement details.
 */
export class NumberArrayWithAttributes extends Attributes {
    /**
     * The values.
     */
    values;
    /**
     * The delimiter of the values.
     */
    delimiter = ",";
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number[]} values The values.
     * @param {string} delimiter The delimiter of the values (Optional - default will be ",").
     */
    constructor(attributes, values, delimiter) {
        super(attributes);
        this.values = values;
        if (delimiter) {
            this.delimiter = delimiter;
        }
    }
    /**
     * @returns A string representation.
     */
    toString() {
        return super.toString() + `, ${this.values.toString()})`;
    }
    /**
     * Set the delimiter.
     * @param {string} delimiter The delimiter.
     */
    setDelimiter(delimiter) {
        this.delimiter = delimiter;
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName, padding) {
        return getTag(this.values.toString().replaceAll(",", this.delimiter), tagName, this.attributes, undefined, undefined, padding, false);
    }
}
//# sourceMappingURL=classes.js.map