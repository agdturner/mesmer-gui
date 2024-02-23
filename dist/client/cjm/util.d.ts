/**
 * Thow an error if the key is not in the map otherwise return the value mapped to the key.
 * @param map The map to search in.
 * @param key The key to search for.
 * @returns The value mapped to the key.
 * @throws An error if the key is not in the map.
 */
export declare function get(map: Map<any, any>, key: any): any;
/**
 * Linearly rescale a value from one range to another.
 * @param min The minimum value of the original range.
 * @param range The original range.
 * @param newMin The minimum value of the new range.
 * @param newRange The new range.
 * @param value The value to rescale.
 * @returns The rescaled value.
 */
export declare function rescale(min: number, range: number, newMin: number, newRange: number, value: number): number;
