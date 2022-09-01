import { ParentNode } from '../constructParentNode';
import { ChildNode } from '../constructChildNode';
import { InsertableNode, isDocumentFragment } from './utils';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedInsertBefore } from './uncheckedInsertBefore';
import { uncheckedAppendChild } from './uncheckedAppendChild';

export function uncheckedRemoveAndInsertBefore(
  parent: ParentNode,
  node: InsertableNode,
  child: ChildNode | null
): void {
  if (!isDocumentFragment(node)) {
    if (node.parentNode != null) {
      uncheckedRemoveChild(node.parentNode, node);
    }
    uncheckedInsertBefore(parent, node, child);
    return;
  }

  child ||= parent.firstChild;

  for (let nodeChild = node.firstChild; nodeChild != null; nodeChild = nodeChild.nextSibling) {
    uncheckedRemoveChild(node, nodeChild);

    if (child != null) {
      uncheckedInsertBefore(parent, nodeChild, child);
    } else {
      uncheckedAppendChild(parent, nodeChild);
    }
  }
}
