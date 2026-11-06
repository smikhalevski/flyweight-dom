import type { DocumentType } from './DocumentType.ts';
import type { Element } from './Element.ts';
import { ParentNode } from './ParentNode.ts';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.ts';
import { defineNodeType, DOCUMENT_NODE, DOCUMENT_TYPE_NODE, ELEMENT_NODE, getNextSiblingOrSelf } from './utils.ts';

/**
 * @see [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) on MDN
 * @group Nodes
 */
export class Document extends ParentNode() {
  /**
   * @see [Document.doctype](https://developer.mozilla.org/en-US/docs/Web/API/Document/doctype) on MDN
   */
  get doctype(): DocumentType | null {
    return getNextSiblingOrSelf(this.firstChild, DOCUMENT_TYPE_NODE) as DocumentType | null;
  }

  /**
   * @see [Document.documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement) on MDN
   */
  get documentElement(): Element | null {
    return getNextSiblingOrSelf(this.firstChild, ELEMENT_NODE) as Element | null;
  }

  cloneNode(deep?: boolean): Document {
    const node = new (this.constructor as typeof Document)();

    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
  }
}

defineNodeType(Document, DOCUMENT_NODE, '#document');
