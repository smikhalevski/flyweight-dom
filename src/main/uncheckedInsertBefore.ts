import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { isElement } from './utils';

export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode | null | undefined): void {
  const { _childNodes: childNodes, _children: children } = parent;

  // node.parentNode = parent;
  //
  // child ||= parent.firstChild;
  //
  // if (child == null) {
  //   // The parent has no children
  //   parent.firstChild = parent.lastChild = node;
  //
  //   childNodes?.push(node);
  //
  //   if (!isElement(node)) {
  //     return;
  //   }
  //
  //   children?.push(node);
  //   return;
  // }
  //
  // const { previousSibling } = child;
  //
  // node.nextSibling = child;
  // child.previousSibling = node;
  //
  // if (previousSibling != null) {
  //   previousSibling.nextSibling = node;
  //   node.previousSibling = previousSibling;
  //
  //   childNodes?.splice(childNodes.indexOf(child), 0, node);
  // } else {
  //   parent.firstChild = node;
  //
  //   childNodes?.unshift(node);
  // }
  //
  //
  //
  // if (children !== undefined && isElement(node)) {
  //   children.splice(children.indexOf(child.nextElementSibling), 0, node);
  // }
}
