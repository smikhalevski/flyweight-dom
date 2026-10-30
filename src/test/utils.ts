import type { Node } from '../main/index.js';

/**
 * Returns child nodes of the parent. Throws if sibling links are inconsistent, so a cyclic list fails a test instead
 * of hanging it.
 */
export function getChildNodes(parent: Node): Node[] {
  const childNodes: Node[] = [];

  let previousSibling = null;

  for (let child = parent.firstChild; child !== null; child = child.nextSibling) {
    if (childNodes.indexOf(child) !== -1 || child.parentNode !== parent || child.previousSibling !== previousSibling) {
      throw new Error('Inconsistent child nodes');
    }

    childNodes.push(child);
    previousSibling = child;
  }

  if (parent.lastChild !== previousSibling) {
    throw new Error('Inconsistent child nodes');
  }

  return childNodes;
}
