import type { Element } from './Element.ts';
import { getNextDescendantInDocumentOrder as importedGetNextDescendantInDocumentOrder } from './getNextDescendantInDocumentOrder.ts';
import type { Node } from './Node.ts';
import { coerceToString, isElement as importedIsElement } from './utils.ts';

// V8 checks an imported function at every call, but inlines a local constant without a check
const getNextDescendantInDocumentOrder = importedGetNextDescendantInDocumentOrder;
const isElement = importedIsElement;

/**
 * Returns an array of elements with the given namespace and local name.
 *
 * @param root The root node where the lookup starts.
 * @param namespaceURI The namespace of the elements. The special string `*` represents all namespaces.
 * @param localName The local name of the elements. The special string `*` represents all elements.
 * @see [getElementsByTagNameNS](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagNameNS) on MDN
 */
export const getElementsByTagNameNS = (
  root: Node,
  namespaceURI: string | null | undefined,
  localName: string
): Element[] => {
  if (namespaceURI === undefined || namespaceURI === '') {
    namespaceURI = null;
  }

  localName = coerceToString(localName);

  const elements: Element[] = [];

  for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
    if (isElement(node) && isMatchingName(node, namespaceURI, localName)) {
      elements.push(node);
    }
  }

  return elements;
};

/**
 * Returns `true` if the element has the given namespace and local name.
 *
 * @param element The element to check.
 * @param namespaceURI The namespace of the element. The special string `*` represents all namespaces.
 * @param localName The local name of the element. The special string `*` represents all elements.
 */
export const isMatchingName = (element: Element, namespaceURI: string | null, localName: string): boolean => {
  return (
    (namespaceURI === '*' || element.namespaceURI === namespaceURI) &&
    (localName === '*' || isEqualLocalName(element, localName))
  );
};

/**
 * Returns `true` if the element has the given local name.
 */
const isEqualLocalName = (element: Element, localName: string): boolean => {
  const { tagName } = element;

  if (element.namespaceURI === null) {
    return tagName === localName;
  }

  return tagName.length - tagName.indexOf(':') - 1 === localName.length && tagName.endsWith(localName);
};
