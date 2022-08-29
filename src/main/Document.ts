import { Node } from './Node';
import { extendsParentNode, ParentNode } from './extendsParentNode';
import { NodeType } from './NodeType';
import { Element } from './Element';
import { DocumentType } from './DocumentType';
import { defineProperty, extendsClass } from './utils';
import { uncheckedCloneContents } from './unchecked';

export interface Document extends Node, ParentNode {
  /*readonly*/ documentElement: Element | null;
}

export class Document {
  /*readonly*/ doctype: DocumentType | null;

  constructor() {
    Node.call(this, NodeType.DOCUMENT_NODE, '#document');

    this.doctype = null;
  }
}

const prototype = extendsClass(Document, Node);

extendsParentNode(prototype);

defineProperty(prototype, 'documentElement', {
  get() {
    return this.firstElementChild;
  },
});

prototype.cloneNode = function (deep) {
  const node = new Document();
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
