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
 * @returns    {string} The nodeValue of the node.
 * @throws An error if the nodeValue is null.
 */
export function getNodeValue(node: ChildNode): string {
    let nodeValue: string | null = node.nodeValue;
    if (nodeValue == null) {
        throw new Error('nodeValue is null');
    }
    return nodeValue;
}