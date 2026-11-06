import type { Node } from './Node.ts';

/**
 * Returns `true` if the other node is the node itself or its descendant.
 */
export function uncheckedContains(node: Node, otherNode: Node): boolean {
  if (node.firstChild === null) {
    return node === otherNode;
  }

  for (let ancestor: Node | null = otherNode; ancestor !== null; ancestor = ancestor.parentNode) {
    if (node === ancestor) {
      return true;
    }
  }

  return node === otherNode;
}
