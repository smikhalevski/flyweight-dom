import { Node } from './Node';
import { NodeFilterConstants } from './utils';

const FILTER = Symbol('filter');

export type NodeFilter = ((node: Node) => number) | { acceptNode(node: Node): number };

export const NodeFilter = {
  FILTER_ACCEPT: NodeFilterConstants.FILTER_ACCEPT,
  FILTER_REJECT: NodeFilterConstants.FILTER_REJECT,
  FILTER_SKIP: NodeFilterConstants.FILTER_SKIP,
  SHOW_ALL: NodeFilterConstants.SHOW_ALL,
  SHOW_ATTRIBUTE: NodeFilterConstants.SHOW_ATTRIBUTE,
  SHOW_CDATA_SECTION: NodeFilterConstants.SHOW_CDATA_SECTION,
  SHOW_COMMENT: NodeFilterConstants.SHOW_COMMENT,
  SHOW_DOCUMENT: NodeFilterConstants.SHOW_DOCUMENT,
  SHOW_DOCUMENT_FRAGMENT: NodeFilterConstants.SHOW_DOCUMENT_FRAGMENT,
  SHOW_DOCUMENT_TYPE: NodeFilterConstants.SHOW_DOCUMENT_TYPE,
  SHOW_ELEMENT: NodeFilterConstants.SHOW_ELEMENT,
  SHOW_PROCESSING_INSTRUCTION: NodeFilterConstants.SHOW_PROCESSING_INSTRUCTION,
  SHOW_TEXT: NodeFilterConstants.SHOW_TEXT,
};

export class NodeIterator {
  root;
  referenceNode;
  pointerBeforeReferenceNode;
  whatToShow;
  filter;

  constructor(root: Node, whatToShow?: number, filter: NodeFilter | null = null) {
    this.referenceNode = this.root = root;
    this.pointerBeforeReferenceNode = true;
    this.whatToShow = whatToShow !== undefined ? whatToShow | 0 : NodeFilterConstants.SHOW_ALL;
    this.filter = filter;
  }

  [FILTER](node: Node): number {
    const { whatToShow, filter } = this;

    if ((((1 << node.nodeType) >> 1) & whatToShow) === 0) {
      return NodeFilterConstants.FILTER_SKIP;
    }
    if (filter === null) {
      return NodeFilterConstants.FILTER_ACCEPT;
    }
    if (typeof filter === 'function') {
      return filter(node);
    }
    return filter.acceptNode(node);
  }

  nextNode(): Node | null {
    const { referenceNode, pointerBeforeReferenceNode } = this;

    this.pointerBeforeReferenceNode = false;

    if (pointerBeforeReferenceNode) {
      return referenceNode;
    }

    let node: Node | null = referenceNode;

    while (node !== null) {
      if (node.firstChild !== null) {
        node = node.firstChild;
      } else if (node.nextSibling !== null) {
        node = node.nextSibling;
      } else {
        do {
          node = node.parentNode;
        } while (node !== null && node.nextSibling === null);

        if (node !== null) {
          node = node.nextSibling;
        }
      }
      if (node !== null && this[FILTER](node) === NodeFilterConstants.FILTER_ACCEPT) {
        this.referenceNode = node;
        return node;
      }
    }

    return null;
  }

  previousNode(): Node | null {
    return null;
  }
}
