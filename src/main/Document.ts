import { Node } from './Node';
import { extendParentNode, ParentNode } from './ParentNode';
import { Element } from './Element';
import { extendClass, getNextSiblingOrSelf, NodeType } from './utils';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';

export interface Document extends Node, ParentNode {
  readonly doctype: DocumentType | null;
  readonly documentElement: Element | null;
}

export class Document {}

const prototype = extendClass(Document, Node);

prototype.nodeType = NodeType.DOCUMENT_NODE;
prototype.nodeName = '#document';

extendParentNode(prototype);

Object.defineProperties(prototype, {
  doctype: {
    get(this: Document) {
      return getNextSiblingOrSelf(this.firstChild, NodeType.DOCUMENT_TYPE_NODE);
    },
  },

  documentElement: {
    get(this: Document) {
      return getNextSiblingOrSelf(this.firstChild, NodeType.ELEMENT_NODE);
    },
  },
});

prototype.cloneNode = function (deep) {
  const node = new Document();
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};
