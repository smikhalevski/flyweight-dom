import { Node } from './Node';
import { extendsParentNode, ParentNode } from './extendsParentNode';
import { NodeType } from './NodeType';
import { extendsClass } from './utils';

export interface DocumentFragment extends Node, ParentNode {}

export class DocumentFragment {
  constructor() {
    Node.call(this, NodeType.DOCUMENT_FRAGMENT_NODE, '#document-fragment');
  }
}

const prototype = extendsClass(DocumentFragment, Node);

extendsParentNode(prototype);
