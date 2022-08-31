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

  append(...nodes: NodeLike[]): this;

  prepend(...nodes: NodeLike[]): this;

  replaceChildren(...nodes: NodeLike[]): this;
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

function append(this: ParentNode, ...nodes: NodeLike[]) {
  coerceInsertableNodes(this, nodes);

  for (const node of nodes) {
    uncheckedRemoveAndAppendChild(this, node);
  }
  return this;
}

function prepend(this: ParentNode, ...nodes: NodeLike[]) {
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
  return this;
}

function replaceChildren(this: ParentNode, ...nodes: NodeLike[]) {
  coerceInsertableNodes(this, nodes);

  while (this.firstChild) {
    uncheckedRemove(this.firstChild);
  }
  for (const node of nodes) {
    uncheckedRemoveAndAppendChild(this, node);
  }
  return this;
}
