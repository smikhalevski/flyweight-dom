import type { Element } from './Element.ts';
import { getNextDescendantInDocumentOrder } from './getNextDescendantInDocumentOrder.ts';
import type { Node } from './Node.ts';
import { coerceToString, isElement } from './utils.ts';

/**
 * Returns an array of elements with the given tag name.
 *
 * @param root The root node where the lookup starts.
 * @param tagName A string representing the name of the elements. The special string `*` represents all elements.
 * @see [getElementsByTagName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName) on MDN
 */
export function getElementsByTagName(root: Node, tagName: string): Element[] {
  tagName = coerceToString(tagName);

  const elements: Element[] = [];

  for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
    if (isElement(node) && (tagName === '*' || node.tagName === tagName)) {
      elements.push(node);
    }
  }

  return elements;
}
