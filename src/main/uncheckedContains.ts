import { Node } from './Node';

export function uncheckedContains(parent: Node, node: Node): boolean {
  if (parent.firstChild != null) {
    let ancestor: Node | null = node;

    while (ancestor != null) {
      if (parent === ancestor) {
        return true;
      }
      ancestor = ancestor.parentNode;
    }
  }
  return parent === node;
}
