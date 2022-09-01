import { Node } from './Node';
import { extendParentNode, ParentNode } from './extendParentNode';
import { NodeType } from './NodeType';
import { extendClass } from './utils';
import { uncheckedCloneContents } from './uncheckedCloneContents';

export interface DocumentFragment extends Node, ParentNode {}

export class DocumentFragment {}

const prototype = extendClass(DocumentFragment, Node);

prototype.nodeType = NodeType.DOCUMENT_FRAGMENT_NODE;
prototype.nodeName = '#document-fragment';

extendParentNode(prototype);

prototype.cloneNode = function (deep) {
  const node = new DocumentFragment();
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
