import type { ChildNode } from './ChildNode.ts';
import type { Node } from './Node.ts';

/**
 * Returns the descendant of the root that follows the given descendant in document order, or `null` if it's the last
 * one. Lets a loop visit all descendants of the root without creating a tree walker:
 *
 * ```ts
 * for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
 *   // Process the node
 * }
 * ```
 *
 * @param descendant The descendant of the root to start from.
 * @param root The node whose descendants are visited. The walk doesn't leave it.
 */
export const getNextDescendantInDocumentOrder = (descendant: Node, root: Node): ChildNode | null => {
  let nextNode = descendant.firstChild;

  // The node has no children, so the next node is the closest sibling that follows the node or its ancestor
  while (nextNode === null && descendant !== root && (nextNode = descendant.nextSibling) === null) {
    descendant = descendant.parentNode!;
  }

  return nextNode;
};
