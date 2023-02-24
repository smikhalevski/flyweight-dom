import { Node } from './Node';
import { extendParentNode, ParentNode } from './ParentNode';
import { Element } from './Element';
import { extendClass, getNextSiblingOrSelf, NodeConstants } from './utils';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DocumentType } from './DocumentType';

export interface Document extends Node, ParentNode {
  readonly doctype: DocumentType | null;
  readonly documentElement: Element | null;
}

export class Document {}

const prototype = extendClass(Document, Node, {
  nodeType: { value: NodeConstants.DOCUMENT_NODE },
  nodeName: { value: '#document' },

  doctype: {
    get() {
      return getNextSiblingOrSelf(this.firstChild, NodeConstants.DOCUMENT_TYPE_NODE) as DocumentType | null;
    },
  },

  documentElement: {
    get() {
      return getNextSiblingOrSelf(this.firstChild, NodeConstants.ELEMENT_NODE) as Element | null;
    },
  },
});

extendParentNode(Document);

prototype.cloneNode = function (deep) {
  const node = new Document();
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};
