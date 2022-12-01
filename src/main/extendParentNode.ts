import { Node } from './Node';
import { Element } from './Element';
import { defineProperty, getNextElementSibling, getPreviousElementSibling, PropertyDescriptor } from './utils';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { assertInsertable, uncheckedToInsertableNode } from './uncheckedToInsertableNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { NodeType } from './NodeType';

export interface ParentNode extends Node {
  // public readonly
  children: Node[];
  childElementCount: number;
  firstElementChild: Element | null;
  lastElementChild: Element | null;

  // private
  _children: Element[] | undefined;

  append(...nodes: Array<Node | string>): this;

  prepend(...nodes: Array<Node | string>): this;

  replaceChildren(...nodes: Array<Node | string>): this;
}

export function extendParentNode(prototype: ParentNode): void {
  defineProperty(prototype, 'children', childrenDescriptor);
  defineProperty(prototype, 'firstElementChild', firstElementChildDescriptor);
  defineProperty(prototype, 'lastElementChild', lastElementChildDescriptor);
  defineProperty(prototype, 'childElementCount', childElementCountDescriptor);

  prototype.append = append;
  prototype.prepend = prepend;
  prototype.replaceChildren = replaceChildren;
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

const firstElementChildDescriptor: PropertyDescriptor<ParentNode, Element | null> = {
  get() {
    return getNextElementSibling(this.firstChild);
  },
};

const lastElementChildDescriptor: PropertyDescriptor<ParentNode, Element | null> = {
  get() {
    return getPreviousElementSibling(this.lastChild);
  },
};

const childElementCountDescriptor: PropertyDescriptor<ParentNode, number> = {
  get() {
    let count = 0;

    for (let node = this.firstChild; node !== null; node = node.previousSibling) {
      if (node.nodeType === NodeType.ELEMENT_NODE) {
        ++count;
      }
    }
    return count;
  },
};

function append(this: ParentNode /*, ...nodes: Array<Node | string>*/) {
  const nodesLength = arguments.length;

  for (let i = 0; i < nodesLength; ++i) {
    assertInsertable(this, arguments[i]);
  }
  for (let i = 0; i < nodesLength; ++i) {
    uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(this, arguments[i]));
  }
  return this;
}

function prepend(this: ParentNode /*, ...nodes: Array<Node | string>*/) {
  const nodesLength = arguments.length;

  const { firstChild } = this;

  for (let i = 0; i < nodesLength; ++i) {
    assertInsertable(this, arguments[i]);
  }

  if (firstChild != null) {
    for (let i = 0; i < nodesLength; ++i) {
      uncheckedRemoveAndInsertBefore(this, uncheckedToInsertableNode(this, arguments[i]), firstChild);
    }
  } else {
    for (let i = 0; i < nodesLength; ++i) {
      uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(this, arguments[i]));
    }
  }
  return this;
}

function replaceChildren(this: ParentNode /*, ...nodes: Array<Node | string>*/) {
  const nodesLength = arguments.length;

  for (let i = 0; i < nodesLength; ++i) {
    assertInsertable(this, arguments[i]);
  }

  while (this.firstChild != null) {
    uncheckedRemoveChild(this, this.firstChild);
  }
  for (let i = 0; i < nodesLength; ++i) {
    uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(this, arguments[i]));
  }
  return this;
}
