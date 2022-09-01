import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedInsertBefore } from './uncheckedInsertBefore';
import { uncheckedAppendChild } from './uncheckedAppendChild';
import { InsertableNode } from './coerceInsertableNodes';
import { isDocumentFragment } from './utils';

export function uncheckedRemoveAndInsertBefore(
  parent: ParentNode,
  node: InsertableNode,
  child: ChildNode | null
): void {
  if (!isDocumentFragment(node)) {
    const { parentNode } = node;

    if (parentNode != null) {
      uncheckedRemoveChild(parentNode, node);
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
