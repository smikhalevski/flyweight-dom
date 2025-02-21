import { InternalChildNode, InternalParentNode } from './utils';

export function uncheckedCloneChildren(sourceParent: InternalParentNode, targetParent: InternalParentNode): void {
  const { firstChild } = sourceParent;

  if (firstChild == null || sourceParent === targetParent) {
    return;
  }

  let { lastChild } = targetParent;

  for (let child: InternalChildNode | null = firstChild; child !== null; child = child.nextSibling) {
    const node = child.cloneNode(true);

    node.parentNode = targetParent;
    node.previousSibling = lastChild;

    if (lastChild !== null) {
      lastChild.nextSibling = node;
    } else {
      targetParent.firstChild = node;
    }
    lastChild = node;
  }

  targetParent.lastChild = lastChild;
}
