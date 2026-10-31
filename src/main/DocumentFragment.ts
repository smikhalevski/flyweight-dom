import type { Element } from './Element.js';
import type { NodeList } from './NodeList.js';
import { ParentNode } from './ParentNode.js';
import { getTextContent, setTextContent } from './Text.js';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.js';
import { defineNodeType, DOCUMENT_FRAGMENT_NODE } from './utils.js';

/**
 * @see [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) on MDN
 * @group Nodes
 */
export class DocumentFragment extends ParentNode() {
  /**
   * Backs {@link children}. Initialized here rather than in the {@link ParentNode} mixin, see there.
   */
  private _children: NodeList<Element> | undefined = undefined;

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

defineNodeType(DocumentFragment, DOCUMENT_FRAGMENT_NODE, '#document-fragment');
