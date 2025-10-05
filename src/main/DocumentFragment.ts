import { Node } from './Node.js';
import { ParentNode } from './ParentNode.js';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.js';
import { getTextContent, setTextContent } from './utils.js';

/**
 * @see [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) on MDN
 * @group Nodes
 */
export class DocumentFragment extends ParentNode() {
  readonly nodeType: number = Node.DOCUMENT_FRAGMENT_NODE;
  readonly nodeName: string = '#document-fragment';

  get textContent(): string | null {
    return getTextContent(this);
  }

  set textContent(value: string | null) {
    setTextContent(this, value);
  }

  cloneNode(deep?: boolean): DocumentFragment {
    const node = new DocumentFragment();
    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
  }
}
