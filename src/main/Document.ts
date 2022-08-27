import { Node } from './Node';
import { extendsParentNode, ParentNode } from './extendsParentNode';
import { NodeType } from './NodeType';
import { Element } from './Element';
import { DocumentType } from './DocumentType';
import { createPrototype } from './utils';

export interface Document extends Node, ParentNode {}

export class Document {
  /*readonly*/ documentElement: Element | null;
  /*readonly*/ doctype: DocumentType | null;

  constructor() {
    Node.call(this, NodeType.DOCUMENT_NODE, '#document');

    this.documentElement = this.doctype = null;
  }
}

const prototype: Document = (Document.prototype = createPrototype(Node.prototype));

extendsParentNode(prototype);
