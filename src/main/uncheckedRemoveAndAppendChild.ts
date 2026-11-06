import type { ParentNode } from './ParentNode.ts';
import { uncheckedAppendChild } from './uncheckedAppendChild.ts';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.ts';
import type { InsertableNode } from './uncheckedToInsertableNode.ts';
import { isDocumentFragment } from './utils.ts';

export function uncheckedRemoveAndAppendChild(parent: ParentNode, node: InsertableNode): void {
  if (isDocumentFragment(node)) {
    node['_notifyChildrenChanged']();

    let fragmentChild = node.firstChild;

    while (fragmentChild !== null) {
      const { nextSibling } = fragmentChild;

      uncheckedAppendChild(parent, fragmentChild);
      fragmentChild = nextSibling;
    }

    node.firstChild = node.lastChild = null;
    return;
  }

  const { parentNode } = node;

  if (parentNode !== null) {
    uncheckedRemoveChild(parentNode, node);
  }

  uncheckedAppendChild(parent, node);
}
