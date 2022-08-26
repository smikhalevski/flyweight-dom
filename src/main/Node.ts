import { Element } from './Element';
import { defineProperty, die } from './utils';
import { ChildNode } from './ChildNode';
import { ParentNode } from './ParentNode';

export interface Node {
  readonly childNodes: readonly ChildNode[];

  nodeValue: string | null;
  textContent: string | null;

  hasChildNodes(): boolean;

  appendChild<T extends Node>(node: T): T;

  insertBefore<T extends Node>(node: T, child: Node | null): T;

  removeChild<T extends Node>(child: T): T;

  replaceChild<T extends Node>(node: Node, child: T): T;

  cloneNode(deep?: boolean): Node;
}

export class Node {
  readonly parentNode: ParentNode | null;
  readonly parentElement: Element | null;
  readonly previousSibling: ChildNode | null;
  readonly nextSibling: ChildNode | null;
  readonly firstChild: ChildNode | null;
  readonly lastChild: ChildNode | null;

  protected _childNodes: ChildNode[] | null;

  constructor(readonly nodeType: number, readonly nodeName: string) {
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
  prototype.removeChild =
  prototype.replaceChild =
    () => {
      die('This node type does not support this method');
    };

prototype.cloneNode = () => {
  die('Abstract method');
};
