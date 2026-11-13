import { Element } from './Element.ts';
import { Node } from './Node.ts';
import { SHOW_ELEMENT } from './NodeFilter.ts';
import { TreeWalker } from './TreeWalker.ts';
import { coerceToString } from './utils.ts';

/**
 * Returns an array of elements with the given namespace and local name.
 *
 * @param root The root node where the lookup starts.
 * @param namespaceURI The namespace of the elements. The special string `*` represents all namespaces.
 * @param localName The local name of the elements. The special string `*` represents all elements.
 * @see [getElementsByTagNameNS](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagNameNS) on MDN
 * @group Other
 */
export function getElementsByTagNameNS(
  root: Node,
  namespaceURI: string | null | undefined,
  localName: string
): Element[] {
  if (namespaceURI === undefined || namespaceURI === '') {
    namespaceURI = null;
  }

  localName = coerceToString(localName);

  const treeWalker = new TreeWalker(root, SHOW_ELEMENT);

  const elements = [];

  for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null;) {
    if (
      (namespaceURI === '*' || element.namespaceURI === namespaceURI) &&
      (localName === '*' || hasLocalName(element, localName))
    ) {
      elements.push(element);
    }
  }

  return elements;
}

/**
 * Returns `true` if the element has the given local name.
 */
function hasLocalName(element: Element, localName: string): boolean {
  const { tagName } = element;

  if (element.namespaceURI === null) {
    return tagName === localName;
  }

  return tagName.length - tagName.indexOf(':') - 1 === localName.length && tagName.endsWith(localName);
}
