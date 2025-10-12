import { Element } from './Element.js';
import { Node } from './Node.js';
import { TreeWalker } from './TreeWalker.js';
import { NodeFilter } from './NodeFilter.js';

/**
 * Returns an array elements which `name` property matches the specified string.
 *
 * @param root The root node where the lookup starts.
 * @param name The value of the `name` attribute of the element(s) we are looking for.
 * @see [getElementsByName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName) on MDN
 * @group Other
 */
export function getElementsByName(root: Node, name: string): Element[] {
  const treeWalker = new TreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const elements = [];

  for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null; ) {
    if (element.attributes.name === name) {
      elements.push(element);
    }
  }

  return elements;
}
