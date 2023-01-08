import { Node } from './Node';

const FILTER_CALLBACK = Symbol('filterCallback');

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

const enum NodeFilterConstants {
  FILTER_ACCEPT = 1,
  FILTER_REJECT = 2,
  FILTER_SKIP = 3,
  SHOW_ALL = 4294967295,
  SHOW_ATTRIBUTE = 2,
  SHOW_CDATA_SECTION = 8,
  SHOW_COMMENT = 128,
  SHOW_DOCUMENT = 256,
  SHOW_DOCUMENT_FRAGMENT = 1024,
  SHOW_DOCUMENT_TYPE = 512,
  SHOW_ELEMENT = 1,
  SHOW_PROCESSING_INSTRUCTION = 64,
  SHOW_TEXT = 4,
}

export class NodeIterator {
  referenceNode;
  pointerBeforeReferenceNode;
  whatToShow;
  filter;

  constructor(readonly root: Node, whatToShow?: number, filter?: NodeFilter | null) {
    this.referenceNode = root;
    this.pointerBeforeReferenceNode = true;
    this.whatToShow =
      whatToShow == null || whatToShow < 0 || whatToShow > 0x7fffffff ? NodeFilterConstants.SHOW_ALL : whatToShow | 0;
    this.filter = filter == null ? null : filter;
  }

  [FILTER_CALLBACK](node: Node): number {
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
      if (node !== null && this[FILTER_CALLBACK](node) === NodeFilterConstants.FILTER_ACCEPT) {
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
