import { Node } from './Node';
import { Element } from './Element';
import { Constructor, die, getNextSiblingOrSelf, getPreviousSiblingOrSelf, isElement } from './utils';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { assertInsertable, assertInsertableNode, uncheckedToInsertableNode } from './uncheckedToInsertableNode';
import { NodeType } from './NodeType';
import { ChildNode } from './extendChildNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';

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

export function extendParentNode(constructor: Constructor<ParentNode>): void {
  const prototype = constructor.prototype;

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

  prototype.appendChild = appendChild;
  prototype.insertBefore = insertBefore;
  prototype.removeChild = removeChild;
  prototype.replaceChild = replaceChild;
  prototype.append = append;
  prototype.prepend = prepend;
  prototype.replaceChildren = replaceChildren;
}

function appendChild<T extends Node>(this: ParentNode, node: T): T {
  assertInsertableNode(this, node);
  uncheckedRemoveAndAppendChild(this, node);
  return node;
}

function insertBefore<T extends Node>(this: ParentNode, node: T, child: Node | null | undefined): T {
  assertInsertableNode(this, node);

  if (child != null) {
    if (child.parentNode !== this) {
      die('The node before which the new node is to be inserted is not a child of this node');
    }
  } else {
    child = this.firstChild;
  }
  if (child != null) {
    uncheckedRemoveAndInsertBefore(this, node, child as ChildNode);
  } else {
    uncheckedRemoveAndAppendChild(this, node);
  }
  return node;
}

function removeChild<T extends Node>(this: Node, child: T): T {
  if (child.parentNode !== this) {
    die('The node to be removed is not a child of this node');
  }
  uncheckedRemoveChild(child.parentNode, child as Node as ChildNode);
  return child;
}

function replaceChild<T extends Node>(this: ParentNode, node: Node, child: T): T {
  assertInsertableNode(this, node);

  if (child.parentNode !== this) {
    die('The node to be replaced is not a child of this node');
  }
  uncheckedRemoveAndInsertBefore(this, node, child as Node as ChildNode);
  uncheckedRemoveChild(this, child as Node as ChildNode);
  return child;
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
