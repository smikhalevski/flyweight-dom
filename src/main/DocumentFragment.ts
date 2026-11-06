import { ParentNode } from './ParentNode.ts';
import { getTextContent, setTextContent } from './Text.ts';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.ts';
import { defineNodeType, DOCUMENT_FRAGMENT_NODE } from './utils.ts';

/**
 * @see [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) on MDN
 * @group Nodes
 */
export class DocumentFragment extends ParentNode() {
  get textContent(): string | null {
    return getTextContent(this);
  }

  set textContent(value: string | null | undefined) {
    setTextContent(this, value);
  }

  cloneNode(deep?: boolean): DocumentFragment {
    const node = new (this.constructor as typeof DocumentFragment)();

    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
  }
}

defineNodeType(DocumentFragment, DOCUMENT_FRAGMENT_NODE, '#document-fragment');
