import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { uncheckedAppendChild } from './uncheckedAppendChild.js';
import { ParentNode } from './ParentNode.js';
import { InsertableNode } from './uncheckedToInsertableNode.js';
import { isDocumentFragment } from './utils.js';

export function uncheckedRemoveAndAppendChild(parent: ParentNode, node: InsertableNode): void {
  if (isDocumentFragment(node)) {
    let nodeChild = node.firstChild;

    while (nodeChild !== null) {
      const { nextSibling } = nodeChild;

      uncheckedAppendChild(parent, nodeChild);
      nodeChild = nextSibling;
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
