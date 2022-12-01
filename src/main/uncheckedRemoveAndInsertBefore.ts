import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedInsertBefore } from './uncheckedInsertBefore';
import { uncheckedAppendChild } from './uncheckedAppendChild';
import { InsertableNode } from './uncheckedToInsertableNode';
import { isDocumentFragment } from './utils';

export function uncheckedRemoveAndInsertBefore(
  parent: ParentNode,
  node: InsertableNode,
  child: ChildNode | null | undefined
): void {
  if (isDocumentFragment(node)) {
    child ||= parent.firstChild;

    if (child != null) {
      for (let nodeChild = node.firstChild; nodeChild != null; nodeChild = nodeChild.nextSibling) {
        uncheckedRemoveChild(node, nodeChild);
        uncheckedInsertBefore(parent, nodeChild, child);
      }
    } else {
      for (let nodeChild = node.firstChild; nodeChild != null; nodeChild = nodeChild.nextSibling) {
        uncheckedRemoveChild(node, nodeChild);
        uncheckedAppendChild(parent, nodeChild);
      }
    }
    return;
  }

  if (node.parentNode != null) {
    uncheckedRemoveChild(node.parentNode, node);
  }
  uncheckedInsertBefore(parent, node, child);
}
