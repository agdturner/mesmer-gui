/**
 * For convertina a map to a string.
 * @param map The map to convert to a string.
 * @returns A string representation of all the entries in the map.
 */
export declare function mapToString(map: Map<any, any>): string;
/**
 * For converting an array to a string.
 * @param {any[]} array The array to convert to a string.
 * @param {string} delimiter The (optional) delimiter.
 */
export declare function arrayToString(array: any[], delimiter: string): string;
/**
 * For converting a string array to a number array.
 * @param {string[]} s The string to convert to a number array.
 * @returns A number array.
 */
export declare function toNumberArray(s: string[]): number[];
/**
 * Is the string numeric in that it can be parsed as a float that is not a NaN?
 * @param {string} s The string.
 * @returns True if the string can be parsed as a float that is not a NaN and false otherwise.
 */
export declare function isNumeric(s: string): boolean;
