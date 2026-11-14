import type { Element } from './Element.ts';
import { getNextDescendantInDocumentOrder as importedGetNextDescendantInDocumentOrder } from './getNextDescendantInDocumentOrder.ts';
import type { Node } from './Node.ts';
import { coerceToString, isElement as importedIsElement } from './utils.ts';

// V8 checks an imported function at every call, but inlines a local constant without a check
const getNextDescendantInDocumentOrder = importedGetNextDescendantInDocumentOrder;
const isElement = importedIsElement;

/**
 * Returns an array elements which `name` property matches the specified string.
 *
 * @param root The root node where the lookup starts.
 * @param name The value of the `name` attribute of the element(s) we are looking for.
 * @see [getElementsByName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName) on MDN
 */
export const getElementsByName = (root: Node, name: string): Element[] => {
  name = coerceToString(name);

  const elements: Element[] = [];

  for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
    if (isElement(node) && node.attributes.name === name) {
      elements.push(node);
    }
  }

  return elements;
};
