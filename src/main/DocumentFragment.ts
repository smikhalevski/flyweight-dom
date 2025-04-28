import { Node } from './Node';
import { extendParentNode, ParentNode } from './ParentNode';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { getTextContent, setTextContent } from './utils';

/**
 * @group Nodes
 */
export interface DocumentFragment extends Node, ParentNode {}

/**
 * @see [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) on MDN
 * @group Nodes
 */
export class DocumentFragment extends Node {
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

extendParentNode(DocumentFragment);
