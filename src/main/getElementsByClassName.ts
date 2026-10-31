import { splitTokens } from './DOMTokenList.js';
import { Element } from './Element.js';
import { Node } from './Node.js';
import { NodeFilter } from './NodeFilter.js';
import { TreeWalker } from './TreeWalker.js';
import { isSpaceChar } from './utils.js';

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

  nextNode: for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null;) {
    // Not element.classList, since it would permanently attach a DOMTokenList to every visited element
    const { className } = element;

    for (let i = 0; i < classNames.length; ++i) {
      if (!hasToken(className, classNames[i])) {
        continue nextNode;
      }
    }

    elements.push(element);
  }

  return elements;
}

/**
 * Returns `true` if the whitespace-separated value contains the token. Doesn't allocate.
 */
function hasToken(value: string, token: string): boolean {
  for (let index = value.indexOf(token); index !== -1; index = value.indexOf(token, index + 1)) {
    const endIndex = index + token.length;

    if (
      (index === 0 || isSpaceChar(value.charCodeAt(index - 1))) &&
      (endIndex === value.length || isSpaceChar(value.charCodeAt(endIndex)))
    ) {
      return true;
    }
  }
  return false;
}
