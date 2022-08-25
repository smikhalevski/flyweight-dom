import { Element } from './Element';
import { die } from './utils';
import { defineProperty } from './utils';
import { NodeType } from './NodeType';

export interface Node {
  readonly childNodes: readonly Node[];

  hasChildNodes(): boolean;

  appendChild<T extends Node>(node: T): T;

  insertBefore<T extends Node>(node: T, child: Node | null): T;

  removeChild<T extends Node>(child: T): T;

  replaceChild<T extends Node>(node: Node, child: T): T;

  cloneNode(deep?: boolean): Node;
}

export class Node {
  static ELEMENT_NODE: number = NodeType.ELEMENT_NODE;
  static ATTRIBUTE_NODE: number = NodeType.ATTRIBUTE_NODE;
  static TEXT_NODE: number = NodeType.TEXT_NODE;
  static CDATA_SECTION_NODE: number = NodeType.CDATA_SECTION_NODE;
  static PROCESSING_INSTRUCTION_NODE: number = NodeType.PROCESSING_INSTRUCTION_NODE;
  static COMMENT_NODE: number = NodeType.COMMENT_NODE;

  readonly parentNode: Node | null;
  readonly parentElement: Element | null;
  readonly previousSibling: Node | null;
  readonly nextSibling: Node | null;
  readonly firstChild: Node | null;
  readonly lastChild: Node | null;

  nodeValue: string | null;

  constructor(readonly nodeType: number) {
    this.parentNode =
      this.parentElement =
      this.previousSibling =
      this.nextSibling =
      this.firstChild =
      this.lastChild =
      this.nodeValue =
        null;
  }
}

const prototype = Node.prototype;

defineProperty(prototype, 'childNodes', {
  get(this: Node): Node['childNodes'] {
    const nodes = [];

    for (let child = this.firstChild; child; child = child.nextSibling) {
      nodes.push(child);
    }
    defineProperty(this, 'childNodes', { value: nodes });

    return nodes;
  },
});

prototype.hasChildNodes =
  prototype.appendChild =
  prototype.insertBefore =
  prototype.removeChild =
  prototype.replaceChild =
  prototype.cloneNode =
    () => {
      die('This node type does not support this method');
    };
