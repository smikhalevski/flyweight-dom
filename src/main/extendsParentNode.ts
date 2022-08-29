import { Node } from './Node';
import { Element } from './Element';
import { coerceAssertChildNodes } from './utils-coerse';
import { isDocumentFragment, uncheckedAppendChild, uncheckedInsertBefore, uncheckedRemove } from './unchecked';
import { defineProperty, PropertyDescriptor } from './utils';

/**
 * @internal
 */
export interface ParentNode extends Node {
  /*readonly*/ children: Node[];
  /*readonly*/ childElementCount: number;
  /*readonly*/ firstElementChild: Element | null;
  /*readonly*/ lastElementChild: Element | null;

  /*private*/ _children: Element[] | null;

  append(...nodes: Array<Node | string>): void;

  prepend(...nodes: Array<Node | string>): void;

  replaceChildren(...nodes: Array<Node | string>): void;
}

/**
 * @internal
 */
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

function append(this: ParentNode, ...nodes: Array<Node | string>): void {
  coerceAssertChildNodes(nodes);

  for (const node of nodes) {
    uncheckedAppendChild(this, node);
  }
}

function prepend(this: ParentNode, ...nodes: Array<Node | string>): void {
  const { firstChild } = this;

  coerceAssertChildNodes(nodes);

  if (firstChild) {
    for (const node of nodes) {
      uncheckedInsertBefore(this, node, firstChild);
    }
  } else {
    for (const node of nodes) {
      uncheckedAppendChild(this, node);
    }
  }
}

function replaceChildren(this: ParentNode, ...nodes: Array<Node | string>): void {
  coerceAssertChildNodes(nodes);

  while (this.firstChild) {
    uncheckedRemove(this.firstChild);
  }
  for (const node of nodes) {
    if (isDocumentFragment(node)) {
    } else {
      uncheckedAppendChild(this, node);
    }
  }
}
