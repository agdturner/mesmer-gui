/**
 * For convertina a map to a string.
 * @param map The map to convert to a string.
 * @returns A string representation of all the entries in the map.
 */
export function mapToString(map) {
    if (map == null) {
        return "";
    }
    return Array.from(map.entries()).map(([key, value]) => `${key == null ? "null" : key.toString()}(${value == null ? "null" : value.toString()})`).join(', ');
}
/**
 * For converting an array to a string.
 * @param array The array to convert to a string.
 */
export function arrayToString(array) {
    if (array == null) {
        return "";
    }
    return array.map((value) => value == null ? "null" : value.toString()).join(', ');
}
/**
 * For converting a string array to a number array.
 * @param {string[]} s The string to convert to a number array.
 * @returns A number array.
 */
export function toNumberArray(s) {
    let r = [];
    for (let i = 0; i < s.length; i++) {
        r.push(parseFloat(s[i]));
    }
    return r;
}
