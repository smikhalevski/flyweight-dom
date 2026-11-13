import type { DocumentType } from './DocumentType.ts';
import type { Element } from './Element.ts';
import { getElementById } from './getElementById.ts';
import { getElementsByClassName } from './getElementsByClassName.ts';
import { getElementsByName } from './getElementsByName.ts';
import { getElementsByTagName } from './getElementsByTagName.ts';
import { getElementsByTagNameNS } from './getElementsByTagNameNS.ts';
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

  /**
   * @see [Document.getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) on MDN
   */
  getElementById(id: string): Element | null {
    return getElementById(this, id);
  }

  /**
   * @see [Document.getElementsByClassName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName) on MDN
   */
  getElementsByClassName(className: string): Element[] {
    return getElementsByClassName(this, className);
  }

  /**
   * @see [Document.getElementsByName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName) on MDN
   */
  getElementsByName(name: string): Element[] {
    return getElementsByName(this, name);
  }

  /**
   * @see [Document.getElementsByTagName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName) on MDN
   */
  getElementsByTagName(tagName: string): Element[] {
    return getElementsByTagName(this, tagName);
  }

  /**
   * @see [Document.getElementsByTagNameNS](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagNameNS) on MDN
   */
  getElementsByTagNameNS(namespaceURI: string | null | undefined, localName: string): Element[] {
    return getElementsByTagNameNS(this, namespaceURI, localName);
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
