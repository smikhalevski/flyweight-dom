import { ParentNode } from './ParentNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedAppendChild } from './uncheckedAppendChild';
import { CHILD_NODES, CHILDREN, isDocumentFragment } from './utils';
import { InsertableNode } from './uncheckedToInsertableNode';

export function uncheckedRemoveAndAppendChild(parent: ParentNode, node: InsertableNode): void {
  if (isDocumentFragment(node)) {
    const childNodes = node[CHILD_NODES];
    const children = node[CHILDREN];

    let nodeChild = node.firstChild;

    while (nodeChild != null) {
      const { nextSibling } = nodeChild;
      uncheckedAppendChild(parent, nodeChild);
      nodeChild = nextSibling;
    }

    if (childNodes != null) {
      childNodes.length = 0;
    }
    if (children != null) {
      children.length = 0;
    }
    node.firstChild = node.lastChild = null;
    return;
  }

  const { parentNode } = node;

  if (parentNode != null) {
    uncheckedRemoveChild(parentNode, node);
  }
  uncheckedAppendChild(parent, node);
}
