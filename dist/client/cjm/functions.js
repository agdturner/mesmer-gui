"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = exports.toNumberArray = exports.arrayToString = exports.mapToString = void 0;
/**
 * For convertina a map to a string.
 * @param map The map to convert to a string.
 * @returns A string representation of all the entries in the map.
 */
function mapToString(map) {
    if (map == null) {
        return "";
    }
    return Array.from(map.entries()).map(([key, value]) => `${key == null ? "null" : key.toString()}(${value == null ? "null" : value.toString()})`).join(', ');
}
exports.mapToString = mapToString;
/**
 * For converting an array to a string.
 * @param {any[]} array The array to convert to a string.
 * @param {string} delimiter The (optional) delimiter.
 */
function arrayToString(array, delimiter) {
    if (array == null) {
        return "";
    }
    if (delimiter == null) {
        delimiter = ', ';
    }
    return array.map((value) => value == null ? "null" : value.toString()).join(delimiter);
}
exports.arrayToString = arrayToString;
/**
 * For converting a string array to a number array.
 * @param {string[]} s The string to convert to a number array.
 * @returns A number array.
 */
function toNumberArray(s) {
    let r = [];
    for (let i = 0; i < s.length; i++) {
        r.push(parseFloat(s[i]));
    }
    return r;
}
exports.toNumberArray = toNumberArray;
/**
 * Is the string numeric in that it can be parsed as a float that is not a NaN?
 * @param {string} s The string.
 * @returns True if the string can be parsed as a float that is not a NaN and false otherwise.
 */
function isNumeric(s) {
    return !isNaN(parseFloat(s));
}
exports.isNumeric = isNumeric;
//# sourceMappingURL=functions.js.map