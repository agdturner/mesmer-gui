"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelfClosingTag = exports.getInput = exports.getDiv = exports.getTable = exports.getTR = exports.getTD = exports.getTH = void 0;
/**
 * Create a table header row.
 * @param {string[]} headings The headings.
 * @returns {string} Table row with headings.
 */
function getTH(headings) {
    var th = "";
    for (let i = 0; i < headings.length; i++) {
        th += "<th>" + headings[i] + "</th>";
    }
    return getTR(th);
}
exports.getTH = getTH;
/**
 * Create a table cell.
 * @param {string} x A cell for a table row.
 * @param {boolean} contentEditable If true then the cell is set to be editable.
 * @returns {string} x wrapped in td tags.
 */
function getTD(x, contentEditable = false) {
    let r = "<td";
    if (contentEditable) {
        r += " contenteditable=\"true\"";
    }
    r += ">" + x + "</td>";
    return r;
}
exports.getTD = getTD;
/**
 * Create a table row.
 * @param {string} x A row for a table.
 * @returns {string} x wrapped in tr tags.
 */
function getTR(x) {
    return "<tr>" + x + "</tr>\n";
}
exports.getTR = getTR;
/**
 * Create a table.
 * @param {string} x Table rows for a table.
 * @returns {string} x wrapped in table tags.
 */
function getTable(x) {
    return "<table>" + x + "</table>";
}
exports.getTable = getTable;
/**
 * Create a div.
 * @param {string} x The content of the div.
 * @param {string | null} id The id of the div.
 * @param {string | null} html_class The class of the div.
 * @returns {string} x wrapped in div tags.
 */
function getDiv(x, id, html_class) {
    let r = "<div";
    if (id !== null) {
        r += " id=\"" + id + "\"";
    }
    if (html_class !== null) {
        r += " class=\"" + html_class + "\"";
    }
    return r + ">" + x + "</div>";
}
exports.getDiv = getDiv;
/**
 * Create a input.
 * @param {string} type The input type (e.g. text, number).
 * @param {string | null} id The id of the button.
 * @param {string | null} func The function called on a change.
 * @param {string | null} value The value of the input.
 * @returns {string} An input HTML element.
 */
function getInput(type, id, func, value) {
    let r = "<input type=\"" + type + "\"";
    if (id !== null) {
        r += " id=\"" + id + "\"";
    }
    if (func !== null) {
        r += " onchange=\"" + func + "\"";
    }
    if (value !== null) {
        r += " value=\"" + value + "\"";
    }
    return r + ">";
}
exports.getInput = getInput;
/**
 * Create a self closing tag.
 * @param {Map<string, string> | null} attributes The attributes.
 * @param {string} tagName The tag name.
 */
function getSelfClosingTag(attributes, tagName) {
    let s = "<" + tagName;
    if (attributes) {
        for (let [key, value] of attributes) {
            s += " " + key + "=\"" + value + "\"";
        }
    }
    return s + " />";
}
exports.getSelfClosingTag = getSelfClosingTag;
//# sourceMappingURL=html.js.map