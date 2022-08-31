import { Node } from '../Node';

/**
 * Returns `true` if the parent contains the node, or `false` otherwise.
 */
export function uncheckedContains(parent: Node, node: Node | null): boolean {
  if (!parent.firstChild || !node) {
    return false;
  }
  while (node) {
    if (parent === node) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
