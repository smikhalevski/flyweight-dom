import { Node } from './Node';
import { extendsParentNode, ParentNode } from './extendsParentNode';
import { NodeType } from './NodeType';
import { createPrototype } from './utils';

export interface DocumentFragment extends Node, ParentNode {}

export class DocumentFragment {
  constructor() {
    Node.call(this, NodeType.DOCUMENT_FRAGMENT_NODE, '#document-fragment');
  }
}

const prototype: DocumentFragment = (DocumentFragment.prototype = createPrototype(Node.prototype));

extendsParentNode(prototype);
