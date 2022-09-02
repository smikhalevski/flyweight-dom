import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';

export function uncheckedCloneContents(origin: ParentNode, parent: ParentNode): void {
  const { firstChild } = origin;

  if (firstChild == null) {
    // The parent has no children
    return;
  }

  let { lastChild } = parent;

  for (let child: ChildNode | null = firstChild; child != null; child = child.nextSibling) {
    const node = child.cloneNode(true);

    node.parentNode = parent;
    node.previousSibling = lastChild;

    if (lastChild != null) {
      lastChild.nextSibling = node;
    }
    lastChild = node;
  }

  parent.lastChild = lastChild;
}
