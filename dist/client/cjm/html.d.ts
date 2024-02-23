/**
 * Create a table header row.
 * @param {string[]} headings The headings.
 * @returns {string} Table row with headings.
 */
export declare function getTH(headings: string[]): string;
/**
 * Create a table cell.
 * @param {string} x A cell for a table row.
 * @param {boolean} contentEditable If true then the cell is set to be editable.
 * @returns {string} x wrapped in td tags.
 */
export declare function getTD(x: string, contentEditable?: boolean): string;
/**
 * Create a table row.
 * @param {string} x A row for a table.
 * @returns {string} x wrapped in tr tags.
 */
export declare function getTR(x: string): string;
/**
 * Create a table.
 * @param {string} x Table rows for a table.
 * @returns {string} x wrapped in table tags.
 */
export declare function getTable(x: string): string;
/**
 * Create a div.
 * @param {string} x The content of the div.
 * @param {string | null} id The id of the div.
 * @param {string | null} html_class The class of the div.
 * @returns {string} x wrapped in div tags.
 */
export declare function getDiv(x: string, id: string | null, html_class: string | null): string;
/**
 * Create a input.
 * @param {string} type The input type (e.g. text, number).
 * @param {string | null} id The id of the button.
 * @param {string | null} func The function called on a change.
 * @param {string | null} value The value of the input.
 * @returns {string} An input HTML element.
 */
export declare function getInput(type: string, id: string | null, func: string | null, value: string | null): string;
/**
 * Create a self closing tag.
 * @param {Map<string, string> | null} attributes The attributes.
 * @param {string} tagName The tag name.
 */
export declare function getSelfClosingTag(attributes: Map<string, string> | null, tagName: string): string;
