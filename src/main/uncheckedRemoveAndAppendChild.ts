import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { uncheckedAppendChild } from './uncheckedAppendChild.js';
import { ParentNode } from './ParentNode.js';
import { InsertableNode } from './uncheckedToInsertableNode.js';
import { isDocumentFragment } from './utils.js';

export function uncheckedRemoveAndAppendChild(parent: ParentNode, node: InsertableNode): void {
  if (isDocumentFragment(node)) {
    const childNodes = node['_childNodes'];
    const children = node['_children'];

    let nodeChild = node.firstChild;

    while (nodeChild !== null) {
      const { nextSibling } = nodeChild;
      uncheckedAppendChild(parent, nodeChild);
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
  uncheckedAppendChild(parent, node);
}
