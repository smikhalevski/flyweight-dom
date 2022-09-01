import { Node } from './Node';
import { Element } from './Element';
import { defineProperty, PropertyDescriptor } from './utils';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { coerceInsertableNodes, NodeLike } from './coerceInsertableNodes';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';

export interface ParentNode extends Node {
  // public readonly
  children: Node[];
  childElementCount: number;
  firstElementChild: Element | null;
  lastElementChild: Element | null;

  // private
  _children: Element[] | undefined;

  append(...nodes: NodeLike[]): this;

  prepend(...nodes: NodeLike[]): this;

  replaceChildren(...nodes: NodeLike[]): this;
}

export function extendParentNode(prototype: ParentNode): void {
  defineProperty(prototype, 'children', childrenDescriptor);

  prototype.append = append;
  prototype.prepend = prepend;
  prototype.replaceChildren = replaceChildren;

  prototype.childElementCount = 0;
  prototype.firstElementChild = prototype.lastElementChild = null;
}

const childrenDescriptor: PropertyDescriptor<ParentNode, Element[]> = {
  get() {
    const nodes: Element[] = (this._children = []);

    for (let child = this.firstElementChild; child != null; child = child.nextElementSibling) {
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

  if (firstChild != null) {
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

  while (this.firstChild != null) {
    uncheckedRemoveChild(this, this.firstChild);
  }
  for (const node of nodes) {
    uncheckedRemoveAndAppendChild(this, node);
  }
  return this;
}
