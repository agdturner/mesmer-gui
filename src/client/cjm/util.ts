/**
 * Thow an error if the key is not in the map otherwise return the value mapped to the key.
 * @param map The map to search in. 
 * @param key The key to search for.
 * @returns The value mapped to the key.
 * @throws An error if the key is not in the map.
 */
export function get(map: Map<any, any>, key: any): any {
    if (!map.has(key)) {
        throw new Error(`Key ${key} not found in map`);
    }
    return map.get(key);
}