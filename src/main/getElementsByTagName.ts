import { Element } from './Element.js';
import { Node } from './Node.js';
import { NodeFilter } from './NodeFilter.js';
import { TreeWalker } from './TreeWalker.js';
import { coerceToString } from './utils.js';

/**
 * Returns an array of elements with the given tag name.
 *
 * @param root The root node where the lookup starts.
 * @param tagName A string representing the name of the elements. The special string `*` represents all elements.
 * @see [getElementsByTagName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName) on MDN
 * @group Other
 */
export function getElementsByTagName(root: Node, tagName: string): Element[] {
  tagName = coerceToString(tagName);

  const treeWalker = new TreeWalker(root, NodeFilter.SHOW_ELEMENT);

  const elements = [];

  for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null;) {
    if (tagName === '*' || element.tagName === tagName) {
      elements.push(element);
    }
  }

  return elements;
}
