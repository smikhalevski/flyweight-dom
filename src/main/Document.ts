import { Node } from './Node';
import { extendParentNode, ParentNode } from './extendParentNode';
import { NodeType } from './NodeType';
import { Element } from './Element';
import { extendClass, getNextSiblingOrSelf } from './utils';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { extendNode } from './extendNode';

export interface Document extends Node, ParentNode {
  readonly doctype: DocumentType | null;
  readonly documentElement: Element | null;
}

export class Document {}

const prototype = extendClass(Document, Node);

prototype.nodeType = NodeType.DOCUMENT_NODE;
prototype.nodeName = '#document';

extendNode(prototype);
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
