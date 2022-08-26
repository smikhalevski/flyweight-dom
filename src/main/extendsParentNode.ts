import { Node } from './Node';
import { Element } from './Element';
import { coerceAssertChildNodes } from './utils-coerse';
import { uncheckedAppendChild, uncheckedInsertBefore, uncheckedRemove } from './utils-unchecked';

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

export function extendsParentNode(prototype: ParentNode): void {
  prototype.append = append;
  prototype.prepend = prepend;
  prototype.replaceChildren = replaceChildren;
}

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
    uncheckedAppendChild(this, node);
  }
}
