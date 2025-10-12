import { Element } from './Element.js';
import { Node } from './Node.js';
import { TreeWalker } from './TreeWalker.js';
import { NodeFilter } from './NodeFilter.js';

/**
 * Returns an element whose `id` property matches the specified string.
 *
 * @param root The root node where the lookup starts.
 * @param id The ID of the element to locate.
 * @see [getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) on MDN
 * @group Other
 */
export function getElementById(root: Node, id: string): Element | null {
  const treeWalker = new TreeWalker(root, NodeFilter.SHOW_ELEMENT);

  for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null; ) {
    if (element.id === id) {
      return element;
    }
  }

  return null;
}
