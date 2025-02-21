import { Node } from './Node';
import { extendParentNode, ParentNode } from './ParentNode';
import { NodeConstants } from './utils';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';

export interface DocumentFragment extends Node, ParentNode {}

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment DocumentFragment} on MDN
 */
export class DocumentFragment extends Node {
  readonly nodeType: number = NodeConstants.DOCUMENT_FRAGMENT_NODE;
  readonly nodeName: string = '#document-fragment';

  cloneNode(deep?: boolean): DocumentFragment {
    const node = new DocumentFragment();
    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
  }
}

extendParentNode(DocumentFragment);
