import { Node } from './Node';
import { Element } from './Element';
import {
  coerceInsertableNodes,
  NodeLike,
  uncheckedRemove,
  uncheckedRemoveAndAppendChild,
  uncheckedRemoveAndInsertBefore,
} from './unchecked';
import { defineProperty, PropertyDescriptor } from './utils';

export interface ParentNode extends Node {
  /*readonly*/ children: Node[];
  /*readonly*/ childElementCount: number;
  /*readonly*/ firstElementChild: Element | null;
  /*readonly*/ lastElementChild: Element | null;

  /*private*/ _children: Element[] | null;

  append(...nodes: NodeLike[]): void;

  prepend(...nodes: NodeLike[]): void;

  replaceChildren(...nodes: NodeLike[]): void;
}

export function constructParentNode(node: ParentNode): void {
  node.childElementCount = 0;
  node.firstElementChild = node.lastElementChild = node._children = null;
}

export function extendsParentNode(prototype: ParentNode): void {
  defineProperty(prototype, 'children', childrenDescriptor);

  prototype.append = append;
  prototype.prepend = prepend;
  prototype.replaceChildren = replaceChildren;
}

const childrenDescriptor: PropertyDescriptor<ParentNode, Element[]> = {
  get() {
    const nodes: Element[] = (this._children = []);

    for (let child = this.firstElementChild; child; child = child.nextElementSibling) {
      nodes.push(child);
    }
    defineProperty(this, 'children', { value: nodes });

    return nodes;
  },
};

function append(this: ParentNode, ...nodes: NodeLike[]): void {
  coerceInsertableNodes(this, nodes);

  for (const node of nodes) {
    uncheckedRemoveAndAppendChild(this, node);
  }
}

function prepend(this: ParentNode, ...nodes: NodeLike[]): void {
  const { firstChild } = this;

  coerceInsertableNodes(this, nodes);

  if (firstChild) {
    for (const node of nodes) {
      uncheckedRemoveAndInsertBefore(this, node, firstChild);
    }
  } else {
    for (const node of nodes) {
      uncheckedRemoveAndAppendChild(this, node);
    }
  }
}

function replaceChildren(this: ParentNode, ...nodes: NodeLike[]): void {
  coerceInsertableNodes(this, nodes);

  while (this.firstChild) {
    uncheckedRemove(this.firstChild);
  }
  for (const node of nodes) {
    uncheckedRemoveAndAppendChild(this, node);
  }
}
