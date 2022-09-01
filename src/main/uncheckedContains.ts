import { Node } from './Node';

export function uncheckedContains(parent: Node, node: Node | null | undefined): boolean {
  if (parent.firstChild != null) {
    while (node != null) {
      if (parent === node) {
        return true;
      }
      node = node.parentNode;
    }
  }
  return false;
}
