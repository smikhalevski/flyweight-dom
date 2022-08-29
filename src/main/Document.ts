import { Node } from './Node';
import { extendsParentNode, ParentNode } from './extendsParentNode';
import { NodeType } from './NodeType';
import { Element } from './Element';
import { DocumentType } from './DocumentType';
import { defineProperty, extendsClass } from './utils';
import { uncheckedCloneContents } from './unchecked';

/**
 * @internal
 */
export interface Document extends Node, ParentNode {
  /*readonly*/ documentElement: Element | null;
  /*readonly*/ doctype: DocumentType | null;
}

/**
 * @internal
 */
export class Document {
  constructor() {
    Node.call(this, NodeType.DOCUMENT_NODE, '#document');
  }
}

const prototype = extendsClass(Document, Node);

extendsParentNode(prototype);

defineProperty(prototype, 'documentElement', {
  get() {
    return this.firstElementChild;
  },
});

defineProperty(prototype, 'doctype', {
  get() {
    const { firstChild } = this;
    return firstChild && firstChild.nodeType !== NodeType.DOCUMENT_TYPE_NODE ? (firstChild as DocumentType) : null;
  },
});

prototype.cloneNode = function (deep) {
  const node = new Document();
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
