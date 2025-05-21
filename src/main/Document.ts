import { Node } from './Node.js';
import { extendParentNode, ParentNode } from './ParentNode.js';
import { Element } from './Element.js';
import { getNextSiblingOrSelf } from './utils.js';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.js';
import { DocumentType } from './DocumentType.js';

/**
 * @group Nodes
 */
export interface Document extends ParentNode {}

/**
 * @see [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) on MDN
 * @group Nodes
 */
export class Document extends Node {
  readonly nodeType: number = Node.DOCUMENT_NODE;
  readonly nodeName: string = '#document';

  /**
   * @see [Document.doctype](https://developer.mozilla.org/en-US/docs/Web/API/Document/doctype) on MDN
   */
  get doctype(): DocumentType | null {
    return getNextSiblingOrSelf(this.firstChild, Node.DOCUMENT_TYPE_NODE) as DocumentType | null;
  }

  /**
   * @see [Document.documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement) on MDN
   */
  get documentElement(): Element | null {
    return getNextSiblingOrSelf(this.firstChild, Node.ELEMENT_NODE) as Element | null;
  }

  cloneNode(deep?: boolean): Document {
    const node = new Document();
    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
  }
}

extendParentNode(Document);
