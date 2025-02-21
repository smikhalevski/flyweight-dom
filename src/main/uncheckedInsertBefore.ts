import { ParentNode } from './ParentNode';
import { ChildNode } from './ChildNode';
import { isElement } from './utils';

export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode): void {
  const childNodes = parent['_childNodes'];
  const children = parent._children;

  const { previousSibling } = child;

  node.parentNode = parent;

  node.nextSibling = child;
  child.previousSibling = node;

  if (previousSibling !== null) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;

    childNodes?.splice(childNodes.indexOf(child), 0, node);
  } else {
    parent.firstChild = node;

    childNodes?.unshift(node);
  }

  if (children !== undefined && isElement(node)) {
    const childElement = isElement(child) ? child : child.nextElementSibling;

    if (childElement !== null) {
      children.splice(children.indexOf(childElement), 0, node);
    } else {
      children.push(node);
    }
  }
}
