import type { Element } from './Element.ts';
import type { Node } from './Node.ts';
import { SHOW_ELEMENT } from './NodeFilter.ts';
import { TreeWalker } from './TreeWalker.ts';
import { coerceToString } from './utils.ts';

/**
 * Returns an array elements which `name` property matches the specified string.
 *
 * @param root The root node where the lookup starts.
 * @param name The value of the `name` attribute of the element(s) we are looking for.
 * @see [getElementsByName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName) on MDN
 */
export function getElementsByName(root: Node, name: string): Element[] {
  name = coerceToString(name);

  const treeWalker = new TreeWalker(root, SHOW_ELEMENT);
  const elements = [];

  for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null;) {
    if (element.attributes.name === name) {
      elements.push(element);
    }
  }

  return elements;
}
