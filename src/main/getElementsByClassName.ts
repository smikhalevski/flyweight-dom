import { Node } from './Node.js';
import { Element } from './Element.js';
import { TreeWalker } from './TreeWalker.js';
import { NodeFilter } from './NodeFilter.js';
import { splitTokens } from './DOMTokenList.js';

/**
 * Returns an array elements which have all of the given class name(s).
 *
 * @param root The root node where the lookup starts.
 * @param className A string representing the class name(s) to match; multiple class names are separated by whitespace.
 * @see [getElementsByClassName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName) on MDN
 * @group Other
 */
export function getElementsByClassName(root: Node, className: string): Element[] {
  const classNames = splitTokens(className);

  if (classNames.length === 0) {
    return [];
  }

  const treeWalker = new TreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const elements = [];

  nextNode: for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null; ) {
    for (let i = 0; i < classNames.length; ++i) {
      if (!element.classList.contains(classNames[i])) {
        continue nextNode;
      }
    }

    elements.push(element);
  }

  return elements;
}
