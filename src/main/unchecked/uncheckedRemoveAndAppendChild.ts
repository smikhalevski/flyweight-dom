import { ParentNode } from '../constructParentNode';
import { InsertableNode, isDocumentFragment } from './utils';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedAppendChild } from './uncheckedAppendChild';

export function uncheckedRemoveAndAppendChild(parent: ParentNode, node: InsertableNode): void {
  if (!isDocumentFragment(node)) {
    if (node.parentNode != null) {
      uncheckedRemoveChild(node.parentNode, node);
    }
    uncheckedAppendChild(parent, node);
    return;
  }

  for (let nodeChild = node.firstChild; nodeChild != null; nodeChild = nodeChild.nextSibling) {
    uncheckedRemoveChild(node, nodeChild);
    uncheckedAppendChild(parent, nodeChild);
  }
}
