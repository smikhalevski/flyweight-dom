import { Node } from './Node';
import { extendParentNode, ParentNode } from './ParentNode';
import { Element } from './Element';
import { getNextSiblingOrSelf, NodeConstants } from './utils';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DocumentType } from './DocumentType';

export interface Document extends ParentNode {}

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document} on MDN
 */
export class Document extends Node {
  readonly nodeType: number = NodeConstants.DOCUMENT_NODE;
  readonly nodeName: string = '#document';

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/doctype Document.doctype} on MDN
   */
  get doctype(): DocumentType | null {
    return getNextSiblingOrSelf(this.firstChild, NodeConstants.DOCUMENT_TYPE_NODE) as DocumentType | null;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement Document.documentElement} on MDN
   */
  get documentElement(): Element | null {
    return getNextSiblingOrSelf(this.firstChild, NodeConstants.ELEMENT_NODE) as Element | null;
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
