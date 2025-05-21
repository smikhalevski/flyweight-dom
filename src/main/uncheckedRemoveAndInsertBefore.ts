import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { uncheckedInsertBefore } from './uncheckedInsertBefore.js';
import { ParentNode } from './ParentNode.js';
import { ChildNode } from './ChildNode.js';
import { InsertableNode } from './uncheckedToInsertableNode.js';
import { isDocumentFragment } from './utils.js';

export function uncheckedRemoveAndInsertBefore(parent: ParentNode, node: InsertableNode, child: ChildNode): void {
  if (isDocumentFragment(node)) {
    const childNodes = node['_childNodes'];
    const children = node['_children'];

    let nodeChild = node.firstChild;

    while (nodeChild !== null) {
      const { nextSibling } = nodeChild;
      uncheckedInsertBefore(parent, nodeChild, child);
      nodeChild = nextSibling;
    }

    if (childNodes !== undefined) {
      childNodes.length = 0;
    }
    if (children !== undefined) {
      children.length = 0;
    }
    node.firstChild = node.lastChild = null;
    return;
  }

  const { parentNode } = node;

  if (parentNode !== null) {
    uncheckedRemoveChild(parentNode, node);
  }
  uncheckedInsertBefore(parent, node, child);
}
