import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { isElement } from './utils';

export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode): void {
  const { _childNodes, _children } = parent;
  const { previousSibling } = child;

  node.parentNode = parent;

  node.nextSibling = child;
  child.previousSibling = node;

  if (previousSibling != null) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;

    _childNodes?.splice(_childNodes.indexOf(child), 0, node);
  } else {
    parent.firstChild = node;

    _childNodes?.unshift(node);
  }

  if (_children != null && isElement(node)) {
    const childElement = isElement(child) ? child : child.nextElementSibling;

    if (childElement != null) {
      _children.splice(_children.indexOf(childElement), 0, node);
    } else {
      _children.push(node);
    }
  }
}
