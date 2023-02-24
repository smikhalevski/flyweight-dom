import { Element } from './Element';
import {
  CHILD_NODES,
  Constructor,
  die,
  extendClass,
  isEqualChildNodes,
  isEqualConstructor,
  NodeConstants,
} from './utils';
import { ChildNode } from './ChildNode';
import { ParentNode } from './ParentNode';
import { uncheckedContains } from './uncheckedContains';

export interface Node {
  // public readonly
  nodeType: number;
  nodeName: string;
  childNodes: readonly ChildNode[];
  parentNode: ParentNode | null;
  parentElement: Element | null;
  previousSibling: ChildNode | null;
  nextSibling: ChildNode | null;
  firstChild: ChildNode | null;
  lastChild: ChildNode | null;

  // public
  nodeValue: string | null;
  textContent: string | null;

  // private
  [CHILD_NODES]: ChildNode[] | undefined;

  hasChildNodes(): boolean;

  appendChild<T extends Node>(node: T): T;

  insertBefore<T extends Node>(node: T, child: Node | null | undefined): T;

  contains(node: Node | null | undefined): boolean;

  removeChild<T extends Node>(child: T): T;

  replaceChild<T extends Node>(node: Node, child: T): T;

  isEqualNode(otherNode: Node | null | undefined): boolean;

  cloneNode(deep?: boolean): this;
}

// abstract
export class Node {
  static ELEMENT_NODE = NodeConstants.ELEMENT_NODE;
  static ATTRIBUTE_NODE = NodeConstants.ATTRIBUTE_NODE;
  static TEXT_NODE = NodeConstants.TEXT_NODE;
  static CDATA_SECTION_NODE = NodeConstants.CDATA_SECTION_NODE;
  static PROCESSING_INSTRUCTION_NODE = NodeConstants.PROCESSING_INSTRUCTION_NODE;
  static COMMENT_NODE = NodeConstants.COMMENT_NODE;
  static DOCUMENT_NODE = NodeConstants.DOCUMENT_NODE;
  static DOCUMENT_TYPE_NODE = NodeConstants.DOCUMENT_TYPE_NODE;
  static DOCUMENT_FRAGMENT_NODE = NodeConstants.DOCUMENT_FRAGMENT_NODE;

  static extend(constructor: Constructor): void {
    extendClass(constructor, this);
  }
}

const prototype = Node.prototype;

prototype.nodeType = -1;
prototype.nodeName = '';

prototype.parentNode = null;
prototype.previousSibling = null;
prototype.nextSibling = null;
prototype.firstChild = null;
prototype.lastChild = null;
prototype.nodeValue = null;
prototype.textContent = null;

Object.defineProperties(prototype, {
  childNodes: {
    get(this: Node) {
      const nodes: ChildNode[] = [];

      this[CHILD_NODES] = nodes;

      for (let child = this.firstChild; child != null; child = child.nextSibling) {
        nodes.push(child);
      }
      Object.defineProperty(this, 'childNodes', { value: nodes });

      return nodes;
    },
  },

  parentElement: {
    get(this: Node) {
      let parent = this.parentNode;

      while (parent != null && parent.nodeType !== NodeConstants.ELEMENT_NODE) {
        parent = parent.parentNode;
      }
      return parent as Element | null;
    },
  },
});

prototype.hasChildNodes = function () {
  return this.firstChild != null;
};

prototype.contains = function (node) {
  return node != null ? uncheckedContains(this, node) : false;
};

function unsupported(): never {
  die('This node type does not support this method');
}

prototype.appendChild = unsupported;
prototype.insertBefore = unsupported;
prototype.removeChild = unsupported;
prototype.replaceChild = unsupported;

prototype.isEqualNode = function (otherNode) {
  return isEqualConstructor(this, otherNode) && isEqualChildNodes(this, otherNode);
};

prototype.cloneNode = () => {
  die('Abstract method');
};
