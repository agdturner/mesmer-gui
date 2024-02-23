"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHTML = exports.getSingularElement = exports.getAttributes = exports.getTag = exports.getEndTag = exports.getStartTag = exports.getNodeValue = exports.getFirstChildNode = exports.getFirstElement = exports.getAttribute = void 0;
/**
 * Get the attribute of an xml element.
 * @param xml The xml element to search in.
 * @param name The name of the attribute to search for.
 * @returns The value of the attribute.
 * @throws An error if the attribute is not found.
 */
function getAttribute(xml, name) {
    let v = xml.getAttribute(name);
    if (!v) {
        throw new Error(name + ' attribute not found');
    }
    return v;
}
exports.getAttribute = getAttribute;
/**
 * Get the first element in element with a tag name tagName.
 * @param element The xml element to search in.
 * @param tagName The tag name of the elements to search for.
 * @returns The first element in element with a tag name tagName.
 * @throws An error if the element is not found.
 */
function getFirstElement(element, tagName) {
    let el = element.getElementsByTagName(tagName)[0];
    if (el == null) {
        throw new Error(tagName + ' element not found');
    }
    return el;
}
exports.getFirstElement = getFirstElement;
/**
 * Get the first childNode.
 * @param {Element} element The xml element to search in.
 * @returns {ChildNode} The first ChildNode if there is one.
 * @throws An error if the element has no childNodes.
 */
function getFirstChildNode(element) {
    let cn = element.childNodes;
    if (cn == null) {
        throw new Error('Element has no childNodes');
    }
    return cn[0];
}
exports.getFirstChildNode = getFirstChildNode;
/**
 * Get the nodeValue of a ChildNode.
 * @param {ChildNode} node The node to get the nodeValue of.
 * @returns {string} The nodeValue of the node.
 * @throws An error if the nodeValue is null.
 */
function getNodeValue(node) {
    let nodeValue = node.nodeValue;
    if (nodeValue == null) {
        throw new Error('nodeValue is null');
    }
    return nodeValue;
}
exports.getNodeValue = getNodeValue;
/**
 * Create and return a XML start tag. For multiple attributes, pass them in a map.
 * If there is only one, then pass the name and value as separate parameters.
 * @param tagName The tag name.
 * @param {Map<string, any>} attributes The attributes (optional).
 * @param {string} attributeName The name of the attribute (optional).
 * @param {any} attributeValue The value of the attribute (optional).
 * @param {string} padding The padding (optional).
 * @returns The XML start tag.
 */
function getStartTag(tagName, attributes, attributeName, attributeValue, padding) {
    let s = "";
    if (padding != undefined) {
        s += "\n" + padding;
    }
    s += '<' + tagName;
    if (attributes) {
        for (let [k, v] of attributes) {
            s += ' ' + k + '="' + v.toString() + '"';
        }
    }
    if (attributeName && attributeValue) {
        s += ' ' + attributeName + '="' + attributeValue.toString() + '"';
    }
    return s + '>';
}
exports.getStartTag = getStartTag;
/**
 * Create and return an XML end tag.
 * @param tagName The tag name.
 * @param padding The padding (optional).
 * @param padValue Whether to pad the value (optional).
 * @returns The XML end tag.
 */
function getEndTag(tagName, padding, padValue) {
    let s = "";
    if (padValue) {
        if (padding != undefined) {
            s += "\n" + padding;
        }
    }
    return s + '</' + tagName + '>';
}
exports.getEndTag = getEndTag;
/**
 * Create and return an XML tag with content. For multiple attributes, pass them in a map.
 * If there is only one, then pass the name and value as separate parameters.
 * @param content The content of the tag.
 * @param tagName The tag name.
 * @param delimeter Whether values are delimeted.
 * @param {Map<string, any>} attributes The attributes (optional).
 * @param {string} attributeName The name of the attribute (optional).
 * @param {any} attributeValue The value of the attribute (optional).
 * @param {string} padding The padding (optional).
 * @param {boolean} padValue Whether to pad the value (optional).
 * @returns The XML tag with content.
 */
function getTag(content, tagName, attributes, attributeName, attributeValue, padding, padValue) {
    let startTag = getStartTag(tagName, attributes, attributeName, attributeValue, padding);
    let endTag = getEndTag(tagName, padding, padValue);
    return startTag + content + endTag;
}
exports.getTag = getTag;
/**
 * Get the attributes of an element.
 * @param {Element} element The element to get the attributes of.
 * @returns {Map<string, string>} The attributes of the element.
 */
function getAttributes(element) {
    let attributeNames = element.getAttributeNames();
    let attributes = new Map();
    attributeNames.forEach(function (attributeName) {
        let attributeValue = element.getAttribute(attributeName);
        if (attributeValue != null) {
            attributes.set(attributeName, attributeValue);
            //console.log("attributeName=" + attributeName + " attributeValue=" + attributeValue);
        }
    });
    return attributes;
}
exports.getAttributes = getAttributes;
/**
 * Get an XML element checking that it is the only one with a given tagName.
 * @param {XMLDocument | Element} xml The XML document or element.
 * @param {string} tagName The tag name.
 * @returns {Element} The element.
 * @throws An error if there is not exactly one element with the given tag name.
 */
function getSingularElement(xml, tagName) {
    ;
    let e = xml.getElementsByTagName(tagName);
    if (e.length != 1) {
        throw new Error("Expecting 1 " + tagName + " but finding " + e.length);
    }
    return e[0];
}
exports.getSingularElement = getSingularElement;
/**
 * Convert XML to HTML.
 * @param {string} text The XML text.
 */
function toHTML(text) {
    return text.replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
        .replace(/  /g, "&nbsp;&nbsp;");
}
exports.toHTML = toHTML;
//# sourceMappingURL=xml.js.map