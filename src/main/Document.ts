import { Node } from './Node';
import { extendParentNode, ParentNode } from './extendParentNode';
import { NodeType } from './NodeType';
import { Element } from './Element';
import { extendClass } from './utils';
import { uncheckedCloneContents } from './uncheckedCloneContents';

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
      let node = this.firstChild;

      while (node != null && node.nodeType !== NodeType.DOCUMENT_TYPE_NODE) {
        node = node.nextSibling;
      }
      return node;
    },
  },
  documentElement: {
    get(this: Document) {
      return this.firstElementChild;
    },
  },
});

prototype.cloneNode = function (deep) {
  const node = new Document();
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
