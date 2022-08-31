import { ParentNode } from '../extendsParentNode';
import { InsertableNode, isDocumentFragment } from './utils';
import { uncheckedRemove } from './uncheckedRemove';
import { uncheckedAppendChild } from './uncheckedAppendChild';

export function uncheckedRemoveAndAppendChild(parent: ParentNode, node: InsertableNode): void {
  if (isDocumentFragment(node)) {
    for (let nodeChild = node.firstChild; nodeChild; nodeChild = nodeChild.nextSibling) {
      uncheckedRemove(nodeChild);
      uncheckedAppendChild(parent, nodeChild);
    }
  } else {
    uncheckedRemove(node);
    uncheckedAppendChild(parent, node);
  }
}
