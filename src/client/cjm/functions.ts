/**
 * For convertina a map to a string.
 * @param map The map to convert to a string.
 * @returns A string representation of all the entries in the map.
 */
export function mapToString(map: Map<any, any>): string {
    if (map == null) {
        return "";
    }
    return Array.from(map.entries()).map(([key, value]) =>
        `${key == null ? "null" : key.toString()}(${value == null ? "null" : value.toString()})`).join(', ');
}

/**
 * For converting an array to a string.
 * @param array The array to convert to a string.
 */
export function arrayToString(array: any[]): string {
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
export function toNumberArray(s: string[]): number[] {
    let r: number[] = [];
    for (let i = 0; i < s.length; i++) {
        r.push(parseFloat(s[i]));
    }
    return r;
}

/**
 * Can the string be converted to a non NaN number via {@link parseFloat(s)}?
 * @param {string} s The string.
 * @returns True if the string can be converted to a non NaN number and false otherwise.
 */
export function isNumeric(s: string): boolean {
    return !isNaN(parseFloat(s));
}