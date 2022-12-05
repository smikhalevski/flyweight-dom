import { Node } from './Node';
import { Element } from './Element';
import { getNextSiblingOrSelf, getPreviousSiblingOrSelf, isElement } from './utils';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { assertInsertable, uncheckedToInsertableNode } from './uncheckedToInsertableNode';
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
        const { _children } = this;

        if (_children) {
          return _children.length;
        }

        let count = 0;

        for (let child = this.firstChild; child != null; child = child.nextSibling) {
          if (isElement(child)) {
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
    uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(arguments[i]));
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
      uncheckedRemoveAndInsertBefore(this, uncheckedToInsertableNode(arguments[i]), firstChild);
    }
  } else {
    for (let i = 0; i < argumentsLength; ++i) {
      uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(arguments[i]));
    }
  }
  return this;
}

function replaceChildren(this: ParentNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  const { _childNodes, _children } = this;

  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(this, arguments[i]);
  }

  for (let child = this.firstChild; child != null; child = child.nextSibling) {
    child.parentNode = child.previousSibling = child.nextSibling = null;
  }
  if (_childNodes != null) {
    _childNodes.length = 0;
  }
  if (_children != null) {
    _children.length = 0;
  }

  this.firstChild = this.lastChild = null;

  for (let i = 0; i < argumentsLength; ++i) {
    uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(arguments[i]));
  }
  return this;
}
