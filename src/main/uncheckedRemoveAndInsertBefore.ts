import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedInsertBefore } from './uncheckedInsertBefore';
import { isDocumentFragment } from './utils';
import { InsertableNode } from './uncheckedToInsertableNode';

export function uncheckedRemoveAndInsertBefore(parent: ParentNode, node: InsertableNode, child: ChildNode): void {
  if (isDocumentFragment(node)) {
    const { _childNodes, _children } = node;

    let nodeChild = node.firstChild;

    while (nodeChild != null) {
      const { nextSibling } = nodeChild;
      uncheckedInsertBefore(parent, nodeChild, child);
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
  uncheckedInsertBefore(parent, node, child);
}
