import type { Node } from './Node.js';

export function uncheckedContains(parent: Node, node: Node): boolean {
  if (parent.firstChild === null) {
    return parent === node;
  }

  for (let ancestor: Node | null = node; ancestor !== null; ancestor = ancestor.parentNode) {
    if (parent === ancestor) {
      return true;
    }
  }

  return parent === node;
}
