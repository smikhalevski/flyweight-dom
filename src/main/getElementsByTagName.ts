import type { Element } from './Element.ts';
import type { Node } from './Node.ts';
import { SHOW_ELEMENT } from './NodeFilter.ts';
import { TreeWalker } from './TreeWalker.ts';
import { coerceToString } from './utils.ts';

/**
 * Returns an array of elements with the given tag name.
 *
 * @param root The root node where the lookup starts.
 * @param tagName A string representing the name of the elements. The special string `*` represents all elements.
 * @see [getElementsByTagName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName) on MDN
 */
export function getElementsByTagName(root: Node, tagName: string): Element[] {
  tagName = coerceToString(tagName);

  const treeWalker = new TreeWalker(root, SHOW_ELEMENT);

  const elements = [];

  for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null;) {
    if (tagName === '*' || element.tagName === tagName) {
      elements.push(element);
    }
  }

  return elements;
}
