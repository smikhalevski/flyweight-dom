import { Node } from '../Node';

/**
 * Returns `true` if the parent contains the node, or `false` otherwise.
 */
export function uncheckedContains(parent: Node, node: Node | null): boolean {
  if (parent.firstChild == null || node == null) {
    return false;
  }
  while (node != null) {
    if (parent === node) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
