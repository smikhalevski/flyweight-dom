import { Node } from './Node';
import { constructParentNode, extendParentNode, ParentNode } from './constructParentNode';
import { NodeType } from './NodeType';
import { Element } from './Element';
import { defineProperty, extendClass } from './utils';
import { uncheckedCloneContents } from './unchecked';
import { constructNode } from './constructNode';

export interface Document extends Node, ParentNode {
  readonly documentElement: Element | null;
}

export class Document {
  constructor() {
    constructNode(this, NodeType.DOCUMENT_NODE, '#document');
    constructParentNode(this);
  }
}

const prototype = extendClass(Document, Node);

extendParentNode(prototype);

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
