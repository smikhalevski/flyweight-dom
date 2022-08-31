import { ParentNode } from '../extendsParentNode';
import { ChildNode } from '../extendsChildNode';
import { InsertableNode, isDocumentFragment } from './utils';
import { uncheckedRemove } from './uncheckedRemove';
import { uncheckedInsertBefore } from './uncheckedInsertBefore';

export function uncheckedRemoveAndInsertBefore(
  parent: ParentNode,
  node: InsertableNode,
  child: ChildNode | null
): void {
  if (isDocumentFragment(node)) {
    for (let nodeChild = node.firstChild; nodeChild; nodeChild = nodeChild.nextSibling) {
      uncheckedRemove(nodeChild);
      uncheckedInsertBefore(parent, nodeChild, child);
    }
  } else {
    uncheckedRemove(node);
    uncheckedInsertBefore(parent, node, child);
  }
}
