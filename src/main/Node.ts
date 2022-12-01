import { Element } from './Element';
import { die } from './utils';
import { ChildNode } from './extendChildNode';
import { ParentNode } from './extendParentNode';
import { NodeType } from './NodeType';

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
  startIndex: number;
  endIndex: number;

  // private
  _childNodes: ChildNode[] | undefined;

  hasChildNodes(): boolean;

  appendChild<T extends Node>(node: T): T;

  insertBefore<T extends Node>(node: T, child: Node | null | undefined): T;

  contains(node: Node | null | undefined): boolean;

  removeChild<T extends Node>(child: T): T;

  replaceChild<T extends Node>(node: Node, child: T): T;

  cloneNode(deep?: boolean): this;
}

// abstract
export class Node {
  constructor() {
    if (this.constructor === Node) {
      die('Illegal constructor');
    }
  }
}

const prototype = Node.prototype;

prototype.startIndex = prototype.endIndex = -1;

prototype.parentNode =
  prototype.previousSibling =
  prototype.nextSibling =
  prototype.firstChild =
  prototype.lastChild =
  prototype.nodeValue =
  prototype.textContent =
    null;

Object.defineProperties(prototype, {
  childNodes: {
    get(this: Node) {
      const nodes: ChildNode[] = (this._childNodes = []);

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

      while (parent !== null && parent.nodeType !== NodeType.ELEMENT_NODE) {
        parent = parent.parentNode;
      }
      return parent as Element | null;
    },
  },
});

prototype.hasChildNodes = function () {
  return this._childNodes != null && this._childNodes.length !== 0;
};

prototype.appendChild =
  prototype.insertBefore =
  prototype.contains =
  prototype.removeChild =
  prototype.replaceChild =
    () => {
      die('This node type does not support this method');
    };

prototype.cloneNode = () => {
  die('Abstract method');
};
