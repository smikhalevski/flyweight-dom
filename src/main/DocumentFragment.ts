import { Node } from './Node';
import { extendParentNode, ParentNode } from './extendParentNode';
import { NodeType } from './NodeType';
import { extendClass } from './utils';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';

export interface DocumentFragment extends Node, ParentNode {}

export class DocumentFragment {}

const prototype = extendClass(DocumentFragment, Node);

prototype.nodeType = NodeType.DOCUMENT_FRAGMENT_NODE;
prototype.nodeName = '#document-fragment';

extendParentNode(DocumentFragment);

prototype.cloneNode = function (deep) {
  const node = new DocumentFragment();
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};
