import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';

export function uncheckedCloneContents(sourceParent: ParentNode, targetParent: ParentNode): void {
  const { firstChild } = sourceParent;

  if (firstChild == null) {
    // The parent has no children
    return;
  }

  let { lastChild } = targetParent;

  for (let child: ChildNode | null = firstChild; child != null; child = child.nextSibling) {
    const node = child.cloneNode(true);

    node.parentNode = targetParent;
    node.previousSibling = lastChild;

    if (lastChild != null) {
      lastChild.nextSibling = node;
    }
    lastChild = node;
  }

  targetParent.lastChild = lastChild;
}
