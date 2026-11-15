import type { Node } from './Node.ts';
import {
  DOCUMENT_POSITION_CONTAINED_BY,
  DOCUMENT_POSITION_CONTAINS,
  DOCUMENT_POSITION_DISCONNECTED,
  DOCUMENT_POSITION_FOLLOWING,
  DOCUMENT_POSITION_PRECEDING,
} from './utils.ts';

/**
 * Returns the position of the other node relative to the node, the same as `compareDocumentPosition` does, but only
 * {@link DOCUMENT_POSITION_DISCONNECTED} is returned for nodes of different trees, since their order is up to the
 * caller.
 */
export const uncheckedCompareDocumentPosition = (node: Node, otherNode: Node): number => {
  if (node === otherNode) {
    return 0;
  }

  let ancestor = node;
  let otherAncestor = otherNode;
  let parent = node.parentNode;
  let otherParent = otherNode.parentNode;

  // Compared nodes are usually close to each other and equally deep, so ancestors of both nodes are read in pairs until
  // they have the same parent, which is faster than counting depths of nodes first
  while (parent !== otherParent) {
    if (parent === null) {
      // The other node is deeper, so it is replaced with its ancestor at the depth of the node
      otherAncestor = getAncestorAtLevel(otherNode, otherParent);

      if (otherAncestor === node) {
        return DOCUMENT_POSITION_CONTAINED_BY | DOCUMENT_POSITION_FOLLOWING;
      }
      ancestor = node;
    } else if (otherParent === null) {
      ancestor = getAncestorAtLevel(node, parent);

      if (ancestor === otherNode) {
        return DOCUMENT_POSITION_CONTAINS | DOCUMENT_POSITION_PRECEDING;
      }
      otherAncestor = otherNode;
    } else {
      ancestor = parent;
      otherAncestor = otherParent;
      parent = ancestor.parentNode;
      otherParent = otherAncestor.parentNode;
      continue;
    }

    parent = ancestor.parentNode;
    otherParent = otherAncestor.parentNode;

    // Ancestors are equally deep now, so they reach the closest common ancestor or roots at once, and aren't checked
    // for null on the way
    while (parent !== otherParent) {
      ancestor = parent!;
      otherAncestor = otherParent!;
      parent = ancestor.parentNode;
      otherParent = otherAncestor.parentNode;
    }
    break;
  }

  // Roots of different trees
  if (parent === null) {
    return DOCUMENT_POSITION_DISCONNECTED;
  }

  // Siblings are read from both ancestors at once, so the number of read siblings doesn't exceed the number of siblings
  // between them
  let sibling: Node | null = ancestor;
  let otherSibling: Node | null = otherAncestor;

  while (true) {
    sibling = sibling.nextSibling;
    otherSibling = otherSibling.nextSibling;

    if (sibling === otherAncestor || otherSibling === null) {
      return DOCUMENT_POSITION_FOLLOWING;
    }
    if (otherSibling === ancestor || sibling === null) {
      return DOCUMENT_POSITION_PRECEDING;
    }
  }
};

/**
 * Returns the ancestor of the node that is one level up for each node from the given level to the root. A walk that
 * reads ancestors of two nodes in pairs reaches the root of the shallower node at the given level of the deeper node,
 * so the returned ancestor is as deep as the shallower node.
 *
 * @param node The deeper node.
 * @param level The ancestor of the deeper node that the walk has reached.
 */
const getAncestorAtLevel = (node: Node, level: Node | null): Node => {
  for (; level !== null; level = level.parentNode) {
    node = node.parentNode!;
  }
  return node;
};
