import { Node } from './Node';
import { Element } from './Element';
import { getNextSiblingOrSelf, getPreviousSiblingOrSelf, isElement } from './utils';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { assertInsertable, uncheckedToInsertableNode } from './uncheckedToInsertableNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { NodeType } from './NodeType';

export interface ParentNode extends Node {
  // public readonly
  readonly children: Node[];
  readonly childElementCount: number;
  readonly firstElementChild: Element | null;
  readonly lastElementChild: Element | null;

  // private
  _children: Element[] | undefined;

  append(...nodes: Array<Node | string>): this;

  prepend(...nodes: Array<Node | string>): this;

  replaceChildren(...nodes: Array<Node | string>): this;
}

export function extendParentNode(prototype: ParentNode): void {
  Object.defineProperties(prototype, {
    children: {
      get(this: ParentNode) {
        const nodes: Element[] = (this._children = []);

        for (let child = this.firstChild; child != null; child = child.nextSibling) {
          if (isElement(child)) {
            nodes.push(child);
          }
        }
        Object.defineProperty(this, 'children', { value: nodes });

        return nodes;
      },
    },

    childElementCount: {
      get(this: ParentNode) {
        let count = 0;

        for (let node = this.firstChild; node != null; node = node.nextSibling) {
          if (isElement(node)) {
            ++count;
          }
        }
        return count;
      },
    },

    firstElementChild: {
      get(this: ParentNode) {
        return getNextSiblingOrSelf(this.firstChild, NodeType.ELEMENT_NODE);
      },
    },

    lastElementChild: {
      get(this: ParentNode) {
        return getPreviousSiblingOrSelf(this.lastChild, NodeType.ELEMENT_NODE);
      },
    },
  });

  prototype.append = append;
  prototype.prepend = prepend;
  prototype.replaceChildren = replaceChildren;
}

function append(this: ParentNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(this, arguments[i]);
  }
  for (let i = 0; i < argumentsLength; ++i) {
    uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(this, arguments[i]));
  }
  return this;
}

function prepend(this: ParentNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  const { firstChild } = this;

  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(this, arguments[i]);
  }

  if (firstChild != null) {
    for (let i = 0; i < argumentsLength; ++i) {
      uncheckedRemoveAndInsertBefore(this, uncheckedToInsertableNode(this, arguments[i]), firstChild);
    }
  } else {
    for (let i = 0; i < argumentsLength; ++i) {
      uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(this, arguments[i]));
    }
  }
  return this;
}

function replaceChildren(this: ParentNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(this, arguments[i]);
  }

  while (this.firstChild != null) {
    uncheckedRemoveChild(this, this.firstChild);
  }
  for (let i = 0; i < argumentsLength; ++i) {
    uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(this, arguments[i]));
  }
  return this;
}
