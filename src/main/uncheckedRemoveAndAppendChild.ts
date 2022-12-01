import { ParentNode } from './extendParentNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedAppendChild } from './uncheckedAppendChild';
import { isDocumentFragment } from './utils';
import { InsertableNode } from './uncheckedToInsertableNode';

export function uncheckedRemoveAndAppendChild(parent: ParentNode, node: InsertableNode): void {
  if (isDocumentFragment(node)) {
    for (let nodeChild = node.firstChild; nodeChild != null; nodeChild = nodeChild.nextSibling) {
      uncheckedRemoveChild(node, nodeChild);
      uncheckedAppendChild(parent, nodeChild);
    }
    return;
  }
  const { parentNode } = node;

  if (parentNode != null) {
    uncheckedRemoveChild(parentNode, node);
  }
  uncheckedAppendChild(parent, node);
}
