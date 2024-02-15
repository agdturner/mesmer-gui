/**
 * Create a table header row.
 * @param {string[]} headings The headings.
 * @returns {string} Table row with headings.
 */
export function getTH(headings: string[]): string {
    var th = "";
    for (let i = 0; i < headings.length; i++) {
        th += "<th>" + headings[i] + "</th>";
    }
    return getTR(th);
}

/**
 * Create a table cell.
 * @param {string} x A cell for a table row.
 * @param {boolean} contentEditable If true then the cell is set to be editable.  
 * @returns {string} x wrapped in td tags.
 */
export function getTD(x: string, contentEditable: boolean = false): string {
    let r: string = "<td";
    if (contentEditable) {
        r += " contenteditable=\"true\"";
    }
    r += ">" + x + "</td>";
    return r;
}

/**
 * Create a table row.
 * @param {string} x A row for a table.
 * @returns {string} x wrapped in tr tags.
 */
export function getTR(x: string): string {
    return "<tr>" + x + "</tr>\n";
}

/**
 * Create a table.
 * @param {string} x Table rows for a table.
 * @returns {string} x wrapped in table tags.
 */
export function getTable(x: string): string {
    return "<table>" + x + "</table>";
}