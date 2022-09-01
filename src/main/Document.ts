import { Node } from './Node';
import { extendParentNode, ParentNode } from './extendParentNode';
import { NodeType } from './NodeType';
import { Element } from './Element';
import { defineProperty, extendClass } from './utils';
import { uncheckedCloneContents } from './uncheckedCloneContents';

export interface Document extends Node, ParentNode {
  // public readonly
  documentElement: Element | null;
}

export class Document {}

const prototype = extendClass(Document, Node);

prototype.nodeType = NodeType.DOCUMENT_NODE;
prototype.nodeName = '#document';

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
