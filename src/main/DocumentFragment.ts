import { Node } from './Node';
import { extendParentNode, ParentNode } from './constructParentNode';
import { NodeType } from './NodeType';
import { extendClass } from './utils';
import { uncheckedCloneContents } from './unchecked';
import { constructNode } from './constructNode';

export interface DocumentFragment extends Node, ParentNode {}

export class DocumentFragment {
  constructor() {
    constructNode(this, NodeType.DOCUMENT_FRAGMENT_NODE, '#document-fragment');
  }
}

const prototype = extendClass(DocumentFragment, Node);

extendParentNode(prototype);

prototype.cloneNode = function (deep) {
  const node = new DocumentFragment();
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
