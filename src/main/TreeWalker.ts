import { Node } from './Node';
import { NodeFilterConstants } from './utils';
import { NodeFilter } from './NodeFilter';

const FILTER = Symbol('filter');

export class TreeWalker {
  currentNode;
  // pointerBeforeReferenceNode;

  // public readonly
  filter;
  root;
  whatToShow;

  [FILTER]: ((node: Node) => number) | null;

  constructor(root: Node, whatToShow?: number, filter: NodeFilter | null = null) {
    this.currentNode = this.root = root;
    // this.pointerBeforeReferenceNode = true;
    this.whatToShow = whatToShow !== undefined ? whatToShow | 0 : NodeFilterConstants.SHOW_ALL;
    this.filter = filter;

    this[FILTER] = filter !== null && typeof filter === 'object' ? node => filter.acceptNode(node) : filter;
  }

  // [FILTER](node: Node): number {
  //   const { whatToShow, filter } = this;
  //
  //   if ((((1 << node.nodeType) >> 1) & whatToShow) === 0) {
  //     return NodeFilterConstants.FILTER_SKIP;
  //   }
  //   if (filter === null) {
  //     return NodeFilterConstants.FILTER_ACCEPT;
  //   }
  //   if (typeof filter === 'function') {
  //     return filter(node);
  //   }
  //   return filter.acceptNode(node);
  // }

  nextNode(): Node | null {
    const { currentNode } = this;

    let node: Node | null = currentNode;
    let result = NodeFilterConstants.FILTER_ACCEPT;

    // this.pointerBeforeReferenceNode = false;
    //
    // if (pointerBeforeReferenceNode) {
    //   return currentNode;
    // }
    //
    // let node: Node | null = currentNode;
    //
    // while (node != null) {
    //   if (node.firstChild != null) {
    //     node = node.firstChild;
    //   } else if (node.nextSibling != null) {
    //     node = node.nextSibling;
    //   } else {
    //     do {
    //       node = node.parentNode;
    //     } while (node != null && node.nextSibling == null);
    //
    //     if (node == null) {
    //       break;
    //     }
    //     node = node.nextSibling;
    //   }
    //   if (node == null) {
    //     break;
    //   }
    //   // const result = this[FILTER](node);
    //   //
    //   // if (result !== NodeFilterConstants.FILTER_REJECT && result !== NodeFilterConstants.FILTER_SKIP) {
    //   //   this.referenceNode = node;
    //   //   return node;
    //   // }
    // }

    return null;
  }

  // previousNode(): Node | null {
  //   const { referenceNode, pointerBeforeReferenceNode } = this;
  //
  //   this.pointerBeforeReferenceNode = true;
  //
  //   if (!pointerBeforeReferenceNode) {
  //     return referenceNode;
  //   }
  //
  //   let node: Node | null = referenceNode;
  //
  //   while (node != null) {
  //     if (node.previousSibling != null) {
  //       node = node.previousSibling;
  //     } else {
  //       do {
  //         node = node.parentNode;
  //       } while (node != null && node.previousSibling == null);
  //     }
  //     if (node == null) {
  //       break;
  //     }
  //     while (node.lastChild != null) {
  //       node = node.lastChild;
  //     }
  //
  //     const result = this[FILTER](node);
  //
  //     if (result !== NodeFilterConstants.FILTER_REJECT && result !== NodeFilterConstants.FILTER_SKIP) {
  //       this.referenceNode = node;
  //       return node;
  //     }
  //   }
  //
  //   return null;
  // }
}
