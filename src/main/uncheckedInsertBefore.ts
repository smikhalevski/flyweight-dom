import { ParentNode } from './ParentNode';
import { ChildNode } from './ChildNode';
import { CHILD_NODES, CHILDREN, isElement } from './utils';

export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode): void {
  const childNodes = parent[CHILD_NODES];
  const children = parent[CHILDREN];

  const { previousSibling } = child;

  node.parentNode = parent;

  node.nextSibling = child;
  child.previousSibling = node;

  if (previousSibling != null) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;

    childNodes?.splice(childNodes.indexOf(child), 0, node);
  } else {
    parent.firstChild = node;

    childNodes?.unshift(node);
  }

  if (children != null && isElement(node)) {
    const childElement = isElement(child) ? child : child.nextElementSibling;

    if (childElement != null) {
      children.splice(children.indexOf(childElement), 0, node);
    } else {
      children.push(node);
    }
  }
}
