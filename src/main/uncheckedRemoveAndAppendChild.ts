import { ParentNode } from './ParentNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedAppendChild } from './uncheckedAppendChild';
import { isDocumentFragment } from './utils';
import { InsertableNode } from './uncheckedToInsertableNode';

export function uncheckedRemoveAndAppendChild(parent: ParentNode, node: InsertableNode): void {
  if (isDocumentFragment(node)) {
    const { _childNodes, _children } = node;

    let nodeChild = node.firstChild;

    while (nodeChild != null) {
      const { nextSibling } = nodeChild;
      uncheckedAppendChild(parent, nodeChild);
      nodeChild = nextSibling;
    }

    if (_childNodes != null) {
      _childNodes.length = 0;
    }
    if (_children != null) {
      _children.length = 0;
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
