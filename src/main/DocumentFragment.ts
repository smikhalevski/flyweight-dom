import { Node } from './Node';
import { extendParentNode, ParentNode } from './ParentNode';
import { extendClass, NodeType } from './utils';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';

export interface DocumentFragment extends Node, ParentNode {}

export class DocumentFragment {}

const prototype = extendClass(DocumentFragment, Node, {
  nodeType: { value: NodeType.DOCUMENT_FRAGMENT_NODE },
  nodeName: { value: '#document-fragment' },
});

extendParentNode(prototype);

prototype.cloneNode = function (deep) {
  const node = new DocumentFragment();
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};
