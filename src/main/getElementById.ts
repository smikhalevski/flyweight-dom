import type { Element } from './Element.ts';
import { getNextDescendantInDocumentOrder } from './getNextDescendantInDocumentOrder.ts';
import type { Node } from './Node.ts';
import { coerceToString, isElement } from './utils.ts';

/**
 * Returns an element whose `id` property matches the specified string.
 *
 * @param root The root node where the lookup starts.
 * @param id The ID of the element to locate.
 * @see [getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) on MDN
 */
export function getElementById(root: Node, id: string): Element | null {
  id = coerceToString(id);

  // An element with an empty id attribute has no ID, and an element without the attribute must not match either
  if (id.length === 0) {
    return null;
  }

  for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
    if (isElement(node) && node.id === id) {
      return node;
    }
  }

  return null;
}
