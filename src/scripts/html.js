/**
 * Create a table header row.
 * @param {string[]} headings The headings.
 * @returns {string} Table row with headings.
 */
export function getTH(headings) {
    var th = "";
    for (let i = 0; i < headings.length; i++) {
        th += "<th>" + headings[i] + "</th>";
    }
    return getTR(th);
}
/**
 * Create a table cell.
 * @param {string} x A cell for a table row.
 * @returns {string} x wrapped in td tags.
 */
export function getTD(x) {
    return "<td>" + x + "</td>";
}
/**
 * Create a table row.
 * @param {string} x A row for a table.
 * @returns {string} x wrapped in tr tags.
 */
export function getTR(x) {
    return "<tr>" + x + "</tr>\n";
}
/**
 * Create a table.
 * @param {string} x Table rows for a table.
 * @returns {string} x wrapped in table tags.
 */
export function getTable(x) {
    return "<table>" + x + "</table>";
}