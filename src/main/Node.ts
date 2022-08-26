import { Element } from './Element';
import { defineProperty, die } from './utils';
import { ChildNode } from './extendsChildNode';
import { ParentNode } from './extendsParentNode';

/**
 * @internal
 */
export interface Node {
  /*readonly*/ childNodes: readonly ChildNode[];

  nodeValue: string | null;
  textContent: string | null;

  hasChildNodes(): boolean;

  appendChild<T extends Node>(node: T): T;

  insertBefore<T extends Node>(node: T, child: Node | null): T;

  contains(node: Node | null): boolean;

  removeChild<T extends Node>(child: T): T;

  replaceChild<T extends Node>(node: Node, child: T): T;

  cloneNode(deep?: boolean): Node;
}

/**
 * @internal
 */
export class Node {
  /*readonly*/ nodeType: number;
  /*readonly*/ nodeName: string;
  /*readonly*/ parentNode: ParentNode | null;
  /*readonly*/ parentElement: Element | null;
  /*readonly*/ previousSibling: ChildNode | null;
  /*readonly*/ nextSibling: ChildNode | null;
  /*readonly*/ firstChild: ChildNode | null;
  /*readonly*/ lastChild: ChildNode | null;

  /*private*/ _childNodes: ChildNode[] | null;

  constructor(nodeType: number, nodeName: string) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.parentNode =
      this.parentElement =
      this.previousSibling =
      this.nextSibling =
      this.firstChild =
      this.lastChild =
      this._childNodes =
        null;
  }
}

const prototype = Node.prototype;

defineProperty(prototype, 'childNodes', {
  get(this: Node) {
    const nodes: ChildNode[] = (this._childNodes = []);

    for (let child = this.firstChild; child; child = child.nextSibling) {
      nodes.push(child);
    }
    defineProperty(this, 'childNodes', { value: nodes });

    return nodes;
  },
});

prototype.hasChildNodes = () => false;

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
