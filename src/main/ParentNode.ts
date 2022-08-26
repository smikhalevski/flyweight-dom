import { Node } from './Node';
import { Element } from './Element';
import {
  assertNoCyclicReference,
  assertNode,
  managesChildNodes,
  Mutable,
  uncheckedAppend,
  uncheckedAppendChild,
  uncheckedInsertBefore,
  uncheckedRemove,
} from './node-utils';
import { Text } from './Text';

export interface ParentNode extends Node {
  readonly childElementCount: number;
  readonly children: Node[];
  readonly firstElementChild: Element | null;
  readonly lastElementChild: Element | null;

  append(...nodes: Array<Node | string>): void;

  prepend(...nodes: Array<Node | string>): void;

  replaceChildren(...nodes: Array<Node | string>): void;
}

export function applyParentNode(node: Mutable<ParentNode>): void {
  node.childElementCount = 0;
  node.firstElementChild = null;
  node.lastElementChild = null;
}

export function coerceNodes(parent: Node, nodes: Array<Node | string>): Node[] {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    if (typeof node === 'string') {
      nodes[i] = new Text(node);
    } else {
      assertNode(node);
      assertNoCyclicReference(parent, node);
    }
  }
  return nodes as Node[];
}

export function extendParentNode(prototype: ParentNode): void {
  prototype.append = function (...nodes: Array<Node | string>): void {
    for (let i = 0; i < arguments.length; ++i) {
      const node = arguments[i];

      if (typeof node !== 'string') {
        assertNode(node);
        assertNoCyclicReference(this, node);
      }
    }
    for (let i = 0; i < arguments.length; ++i) {
      const node = arguments[i];

      uncheckedAppendChild(this, typeof node !== 'string' ? node : new Text(node));
    }
  };

  prototype.prepend = function (...nodes: Array<Node | string>): void {
    const nodeList = coerceNodes(this, nodes);
    const { firstChild } = this;

    if (firstChild) {
      for (const node of nodeList) {
        uncheckedRemove(node);
        uncheckedInsertBefore(this, node, firstChild);
      }
    } else {
      for (const node of nodeList) {
        uncheckedRemove(node);
        uncheckedAppendChild(this, node);
      }
    }
    if (managesChildNodes(this)) {
      this.childNodes.unshift(...nodeList);
    }
  };

  prototype.replaceChildren = function (...nodes: Array<Node | string>): void {
    const nodeList = coerceNodes(this, nodes);

    while (this.firstChild) {
      uncheckedRemove(this.firstChild);
    }
    uncheckedAppend(this, nodeList);
  };
}
