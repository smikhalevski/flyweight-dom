import { ChildNode } from './ChildNode';
import { ParentNode } from './ParentNode';
import { isElement } from './utils';

export function uncheckedRemoveChild(parent: ParentNode, child: ChildNode): void {
  const { previousSibling, nextSibling } = child;
  const { _childNodes, _children } = parent;

  _childNodes?.splice(_childNodes.indexOf(child), 1);

  if (isElement(child)) {
    _children?.splice(_children.indexOf(child), 1);
  }

  child.parentNode = null;

  if (previousSibling != null) {
    previousSibling.nextSibling = nextSibling;
    child.previousSibling = null;
  } else {
    parent.firstChild = nextSibling;
  }

  if (nextSibling != null) {
    nextSibling.previousSibling = previousSibling;
    child.nextSibling = null;
  } else {
    parent.lastChild = previousSibling;
  }
}
