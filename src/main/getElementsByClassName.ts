import { splitTokens } from './DOMTokenList.ts';
import type { Element } from './Element.ts';
import { getNextDescendantInDocumentOrder } from './getNextDescendantInDocumentOrder.ts';
import type { Node } from './Node.ts';
import { coerceToString, isElement, isSpaceChar } from './utils.ts';

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

  const elements: Element[] = [];

  for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
    if (isElement(node) && hasClassNames(node, classNames)) {
      elements.push(node);
    }
  }

  return elements;
}

/**
 * Returns `true` if the element has all of the given class names.
 */
export function hasClassNames(element: Element, classNames: string[]): boolean {
  // Not element.classList, since it would permanently attach a DOMTokenList to every checked element
  const elementClassName = element.className;

  for (let i = 0; i < classNames.length; ++i) {
    if (!hasToken(elementClassName, classNames[i])) {
      return false;
    }
  }
  return true;
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
