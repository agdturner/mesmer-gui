import e from "express";

/**
 * Get the attribute of an xml element.
 * @param xml The xml element to search in.
 * @param name The name of the attribute to search for.
 * @returns The value of the attribute.
 * @throws An error if the attribute is not found.
 */
export function getAttribute(xml: Element, name: string): string {
    let v: string | null = xml.getAttribute(name);
    if (!v) {
        throw new Error(name + ' attribute not found');
    }
    return v;
}

/**
 * Get the first element in element with a tag name tagName.
 * @param element The xml element to search in.
 * @param tagName The tag name of the elements to search for.
 * @returns The first element in element with a tag name tagName.
 * @throws An error if the element is not found.
 */
export function getFirstElement(element: Element, tagName: string): Element {
    let el: Element | null = element.getElementsByTagName(tagName)[0];
    if (el == null) {
        throw new Error(tagName + ' element not found');
    }
    return el;
}

/**
 * Get the first childNode.
 * @param {Element} element The xml element to search in.
 * @returns {ChildNode} The first ChildNode if there is one.
 * @throws An error if the element has no childNodes.
 */
export function getFirstChildNode(element: Element): ChildNode {
    let cn: NodeListOf<ChildNode> = element.childNodes;
    if (cn == null) {
        throw new Error('Element has no childNodes');
    }
    return cn[0];
}

/**
 * Get the nodeValue of a ChildNode.
 * @param {ChildNode} node The node to get the nodeValue of.
 * @returns {string} The nodeValue of the node.
 * @throws An error if the nodeValue is null.
 */
export function getNodeValue(node: ChildNode): string {
    let nodeValue: string | null = node.nodeValue;
    if (nodeValue == null) {
        throw new Error('nodeValue is null');
    }
    return nodeValue;
}

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
export function getStartTag(tagName: string, attributes?: Map<string, any>,
    attributeName?: string, attributeValue?: any, padding?: string): string {
    let s: string = "";
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

/**
 * Create and return an XML end tag.
 * @param tagName The tag name.
 * @param padding The padding (optional).
 * @returns The XML end tag.
 */
export function getEndTag(tagName: string, padding?: string): string {
    let s: string = "";
    if (padding != undefined) {
        s += "\n" + padding;
    }
    return s + '</' + tagName + '>';
}

/**
 * Create and return an XML tag with content. For multiple attributes, pass them in a map.
 * If there is only one, then pass the name and value as separate parameters.
 * @param content The content of the tag.
 * @param tagName The tag name.
 * @param delimeter Whether values are delimeted.
 * @param {Map<string, any>} attributes The attributes (optional).
 * @param {string} attributeName The name of the attribute (optional).
 * @param {any} attributeValue The value of the attribute (optional).
 * @param {string} pad The pad (optional).
 * @param {boolean} padValue Whether to pad the value (optional).
 * @returns The XML tag with content.
 */
export function getTag(content: string, tagName: string, attributes?: Map<string, any>,
    attributeName?: string, attributeValue?: any, padding?: string, pad?: string, padValue?: boolean): string {
    let startTag: string = getStartTag(tagName, attributes, attributeName, attributeValue, padding);
    let endTag: string = "";
    if (padValue) {
        content = "\n" + padding + pad + content;
        endTag = getEndTag(tagName, padding);
    } else {
        endTag = getEndTag(tagName);
    }
    return startTag + content + endTag;
}