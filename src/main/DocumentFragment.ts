import { ParentNode } from './ParentNode.js';
import { getTextContent, setTextContent } from './Text.js';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.js';
import { DOCUMENT_FRAGMENT_NODE } from './utils.js';

/**
 * @see [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) on MDN
 * @group Nodes
 */
export class DocumentFragment extends ParentNode() {
  readonly nodeType: number = DOCUMENT_FRAGMENT_NODE;
  readonly nodeName: string = '#document-fragment';

  get textContent(): string | null {
    return getTextContent(this);
  }

  set textContent(value: string | null) {
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
