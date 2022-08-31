import { Node } from './Node';
import { extendsParentNode, ParentNode } from './extendsParentNode';
import { NodeType } from './NodeType';
import { Element } from './Element';
import { defineProperty, extendsClass } from './utils';
import { uncheckedCloneContents } from './unchecked';

export interface Document extends Node, ParentNode {
  /*readonly*/ documentElement: Element | null;
}

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

prototype.cloneNode = function (deep) {
  const node = new Document();
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
