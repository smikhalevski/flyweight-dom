import { splitTokens } from './DOMTokenList.ts';
import type { Element } from './Element.ts';
import type { Node } from './Node.ts';
import { SHOW_ELEMENT } from './NodeFilter.ts';
import { TreeWalker } from './TreeWalker.ts';
import { coerceToString, isSpaceChar } from './utils.ts';

/**
 * Returns an array elements which have all of the given class name(s).
 *
 * @param root The root node where the lookup starts.
 * @param className A string representing the class name(s) to match; multiple class names are separated by whitespace.
 * @see [getElementsByClassName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName) on MDN
 */
export function getElementsByClassName(root: Node, className: string): Element[] {
  className = coerceToString(className);

  const classNames = splitTokens(className);

  if (classNames.length === 0) {
    return [];
  }

  const treeWalker = new TreeWalker(root, SHOW_ELEMENT);
  const elements = [];

  nextElement: for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null;) {
    // Not element.classList, since it would permanently attach a DOMTokenList to every visited element
    const elementClassName = element.className;

    for (let i = 0; i < classNames.length; ++i) {
      if (!hasToken(elementClassName, classNames[i])) {
        continue nextElement;
      }
    }

    elements.push(element);
  }

  return elements;
}

/**
 * Returns `true` if the whitespace-separated value contains the token.
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
