import { Element } from './Element';
import { defineProperty, die } from './utils';
import { ChildNode } from './constructChildNode';
import { ParentNode } from './constructParentNode';
import { constructNode } from './constructNode';

export interface Node {
  /*readonly*/ nodeType: number;
  /*readonly*/ nodeName: string;
  /*readonly*/ childNodes: readonly ChildNode[];
  /*readonly*/ parentNode: ParentNode | null;
  /*readonly*/ parentElement: Element | null;
  /*readonly*/ previousSibling: ChildNode | null;
  /*readonly*/ nextSibling: ChildNode | null;
  /*readonly*/ firstChild: ChildNode | null;
  /*readonly*/ lastChild: ChildNode | null;

  nodeValue: string | null;
  textContent: string | null;
  startIndex: number;
  endIndex: number;

  /*private*/ _childNodes: ChildNode[] | null;

  hasChildNodes(): boolean;

  appendChild<T extends Node>(node: T): T;

  insertBefore<T extends Node>(node: T, child: Node | null): T;

  contains(node: Node | null): boolean;

  removeChild<T extends Node>(child: T): T;

  replaceChild<T extends Node>(node: Node, child: T): T;

  cloneNode(deep?: boolean): this;
}

export class Node {
  constructor(nodeType: number, nodeName: string) {
    constructNode(this, nodeType, nodeName);
  }
}

const prototype = Node.prototype;

defineProperty(prototype, 'childNodes', {
  get() {
    const nodes: ChildNode[] = (this._childNodes = []);

    for (let child = this.firstChild; child != null; child = child.nextSibling) {
      nodes.push(child);
    }
    defineProperty(this, 'childNodes', { value: nodes });

    return nodes;
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
