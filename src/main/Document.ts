import { Node } from './Node';
import { extendParentNode, ParentNode } from './ParentNode';
import { Element } from './Element';
import { extendClass, getNextSiblingOrSelf, NodeType } from './utils';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DocumentType } from './DocumentType';

export interface Document extends Node, ParentNode {
  readonly doctype: DocumentType | null;
  readonly documentElement: Element | null;
}

export class Document {}

const prototype = extendClass(Document, Node, {
  nodeType: { value: NodeType.DOCUMENT_NODE },
  nodeName: { value: '#document' },

  doctype: {
    get() {
      return getNextSiblingOrSelf(this.firstChild, NodeType.DOCUMENT_TYPE_NODE) as DocumentType | null;
    },
  },

  documentElement: {
    get() {
      return getNextSiblingOrSelf(this.firstChild, NodeType.ELEMENT_NODE) as Element | null;
    },
  },
});

extendParentNode(prototype);

prototype.cloneNode = function (deep) {
  const node = new Document();
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};
