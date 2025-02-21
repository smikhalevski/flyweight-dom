import { MutableChildNode, MutableParentNode } from './utils';

export function uncheckedCloneChildren(sourceParent: MutableParentNode, targetParent: MutableParentNode): void {
  const { firstChild } = sourceParent;

  if (firstChild == null || sourceParent === targetParent) {
    return;
  }

  let { lastChild } = targetParent;

  for (let child: MutableChildNode | null = firstChild; child !== null; child = child.nextSibling) {
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
