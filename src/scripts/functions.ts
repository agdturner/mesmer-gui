/**
 * For convertina a map to a string.
 * @param map The map to convert to a string.
 * @returns A string representation of all the entries in the map.
 */
export function mapToString(map: Map<any, any>): string {
    if (map == null) {
        return "";
    }
    return Array.from(map.entries()).map(([key, value]) => `${key.toString()}(${value.toString()})`).join(', ');
}

/**
 * For converting an array to a string.
 * @param array The array to convert to a string.
 */
export function arrayToString(array: any[]): string {
    if (array == null) {
        return "";
    }
    return array.map((value) => value.toString()).join(', ');
}