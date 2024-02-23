declare global {
    interface Window {
        loadXML(): void;
        saveXML(): void;
    }
}
/**
 * Set the energy of a molecule when the energy input value is changed.
 * @param input The input element.
 */
export declare function setEnergy(input: HTMLInputElement): void;
