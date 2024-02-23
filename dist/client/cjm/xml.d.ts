/**
 * Get the attribute of an xml element.
 * @param xml The xml element to search in.
 * @param name The name of the attribute to search for.
 * @returns The value of the attribute.
 * @throws An error if the attribute is not found.
 */
export declare function getAttribute(xml: Element, name: string): string;
/**
 * Get the first element in element with a tag name tagName.
 * @param element The xml element to search in.
 * @param tagName The tag name of the elements to search for.
 * @returns The first element in element with a tag name tagName.
 * @throws An error if the element is not found.
 */
export declare function getFirstElement(element: Element, tagName: string): Element;
/**
 * Get the first childNode.
 * @param {Element} element The xml element to search in.
 * @returns {ChildNode} The first ChildNode if there is one.
 * @throws An error if the element has no childNodes.
 */
export declare function getFirstChildNode(element: Element): ChildNode;
/**
 * Get the nodeValue of a ChildNode.
 * @param {ChildNode} node The node to get the nodeValue of.
 * @returns {string} The nodeValue of the node.
 * @throws An error if the nodeValue is null.
 */
export declare function getNodeValue(node: ChildNode): string;
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
export declare function getStartTag(tagName: string, attributes?: Map<string, any>, attributeName?: string, attributeValue?: any, padding?: string): string;
/**
 * Create and return an XML end tag.
 * @param tagName The tag name.
 * @param padding The padding (optional).
 * @param padValue Whether to pad the value (optional).
 * @returns The XML end tag.
 */
export declare function getEndTag(tagName: string, padding?: string, padValue?: boolean): string;
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
export declare function getTag(content: string, tagName: string, attributes?: Map<string, any>, attributeName?: string, attributeValue?: any, padding?: string, padValue?: boolean): string;
/**
 * Get the attributes of an element.
 * @param {Element} element The element to get the attributes of.
 * @returns {Map<string, string>} The attributes of the element.
 */
export declare function getAttributes(element: Element): Map<string, string>;
/**
 * Get an XML element checking that it is the only one with a given tagName.
 * @param {XMLDocument | Element} xml The XML document or element.
 * @param {string} tagName The tag name.
 * @returns {Element} The element.
 * @throws An error if there is not exactly one element with the given tag name.
 */
export declare function getSingularElement(xml: XMLDocument | Element, tagName: string): Element;
/**
 * Convert XML to HTML.
 * @param {string} text The XML text.
 */
export declare function toHTML(text: string): string;
