import { ParentNode } from './ParentNode';
import { ChildNode } from './ChildNode';

export function uncheckedCloneChildren(sourceParent: ParentNode, targetParent: ParentNode): void {
  const { firstChild } = sourceParent;

  if (firstChild === null || sourceParent === targetParent) {
    return;
  }

  let { lastChild } = targetParent;

  for (let child: ChildNode | null = firstChild; child !== null; child = child.nextSibling) {
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
